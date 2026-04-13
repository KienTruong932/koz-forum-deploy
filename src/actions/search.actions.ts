"use server"

import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';
import Thread from '@/models/Thread';
import User from '@/models/User';
import Category from '@/models/Category';

export async function globalSearch(query: string) {
  if (!query || query.trim() === '') return [];

  await connectToDatabase();
  
  const regexQuery = new RegExp(query, 'i');

  const [postsByText, threadsByText, usersByRegex] = await Promise.all([
    Post.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } }).lean().catch(() => []),
    Thread.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } }).lean().catch(() => []),
    User.find({ username: regexQuery }).lean(),
  ]);

  const resultMap = new Map<string, any>();

  for (const p of postsByText as any[]) {
    if (!resultMap.has(p._id.toString())) {
      resultMap.set(p._id.toString(), { post: p, score: p.score || 0 });
    } else {
      resultMap.get(p._id.toString()).score += (p.score || 0);
    }
  }

  if (threadsByText.length > 0) {
    const threadIds = threadsByText.map((t: any) => t._id);
    const firstPosts = await Post.aggregate([
      { $match: { thread_id: { $in: threadIds } } },
      { $sort: { created_at: 1 } },
      { $group: { _id: "$thread_id", post: { $first: "$$ROOT" } } }
    ]);
    
    const firstPostMap = new Map();
    firstPosts.forEach((item: any) => {
       firstPostMap.set(item._id.toString(), item.post);
    });

    for (const t of threadsByText as any[]) {
      const p = firstPostMap.get(t._id.toString());
      if (p) {
        if (!resultMap.has(p._id.toString())) {
          resultMap.set(p._id.toString(), { post: p, score: t.score || 0 });
        } else {
          resultMap.get(p._id.toString()).score += (t.score || 0);
        }
      }
    }
  }

  if (usersByRegex.length > 0) {
    const userIds = usersByRegex.map((u: any) => u._id);
    const userPosts = await Post.aggregate([
      { $match: { author_id: { $in: userIds } } },
      { $sort: { created_at: -1 } },
      { $group: { _id: "$author_id", posts: { $push: "$$ROOT" } } }
    ]);

    userPosts.forEach((userGroup: any) => {
       const userScore = 5; 
       userGroup.posts.slice(0, 3).forEach((p: any) => {
         if (!resultMap.has(p._id.toString())) {
            resultMap.set(p._id.toString(), { post: p, score: userScore });
         } else {
            resultMap.get(p._id.toString()).score += userScore;
         }
       });
    });
  }

  const combinedResults = Array.from(resultMap.values()).sort((a, b) => b.score - a.score);

  const postDocuments = combinedResults.map(r => r.post);
  
  await Post.populate(postDocuments, [
    { path: 'author_id', select: 'username avatar' },
    { 
      path: 'thread_id', 
      select: 'title slug category_id',
      populate: { path: 'category_id', model: Category, select: 'name slug' }
    }
  ]);

  return JSON.parse(JSON.stringify(postDocuments));
}
