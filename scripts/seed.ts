import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config({ path: '.env.local' });
dotenv.config();

import User from '../src/models/User';
import Section from '../src/models/Section';
import Category from '../src/models/Category';
import Thread from '../src/models/Thread';
import Post from '../src/models/Post';
import Like from '../src/models/Like';
import { UserStatus, Gender, Role, ThreadStatus } from '../src/lib/enums';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error('Thiếu MONGODB_URI trong file .env');

// ─── Tài khoản mặc định ──────────────────────────────────────────────────────

const USERS = [
  { username: 'admin',        display_name: 'Admin KOZ',         email: 'admin@kozforum.com',      role: Role.ADMIN,      gender: Gender.MALE   },
  { username: 'mod_phanhung', display_name: 'Phan Hùng',         email: 'phanhung@kozforum.com',   role: Role.MODERATOR,  gender: Gender.MALE   },
  { username: 'mod_thaonhi',  display_name: 'Thảo Nhi Mod',      email: 'thaonhi@kozforum.com',    role: Role.MODERATOR,  gender: Gender.FEMALE },
  { username: 'mod_quocbao',  display_name: 'Quốc Bảo',          email: 'quocbao@kozforum.com',    role: Role.MODERATOR,  gender: Gender.MALE   },
  { username: 'ttkhoa',       display_name: 'Trần Tuấn Khoa',    email: 'ttkhoa@gmail.com',        role: Role.MEMBER,     gender: Gender.MALE   },
  { username: 'nvmanh',       display_name: 'Nguyễn Văn Mạnh',   email: 'nvmanh@gmail.com',        role: Role.MEMBER,     gender: Gender.MALE   },
  { username: 'buildpc_viet', display_name: 'Build PC Việt',     email: 'buildpcviet@gmail.com',   role: Role.MEMBER,     gender: Gender.OTHER  },
  { username: 'coder_hung',   display_name: 'Hùng Coder',        email: 'hungcoder@gmail.com',     role: Role.MEMBER,     gender: Gender.MALE   },
  { username: 'linuxfan',     display_name: 'Linux Fan VN',      email: 'linuxfan@gmail.com',      role: Role.MEMBER,     gender: Gender.MALE   },
  { username: 'overclocker',  display_name: 'Overclocker VN',    email: 'overclocker@gmail.com',   role: Role.MEMBER,     gender: Gender.MALE   },
  { username: 'react_dev',    display_name: 'Dev React',         email: 'reactdev@gmail.com',      role: Role.MEMBER,     gender: Gender.OTHER  },
  { username: 'phamthanhan',  display_name: 'Phạm Thanh An',     email: 'pthanh@gmail.com',        role: Role.MEMBER,     gender: Gender.FEMALE },
  { username: 'iot_maker',    display_name: 'Maker IoT',         email: 'iotmaker@gmail.com',      role: Role.MEMBER,     gender: Gender.MALE   },
  { username: 'mechanic_pro', display_name: 'Thợ Cơ Khí Pro',   email: 'mechanicpro@gmail.com',   role: Role.MEMBER,     gender: Gender.MALE   },
  { username: 'dinhbaotran',  display_name: 'Đinh Bảo Trân',     email: 'dbtran@gmail.com',        role: Role.MEMBER,     gender: Gender.FEMALE },
  { username: 'hardwarenerd', display_name: 'Hardware Nerd',     email: 'hwnerds@gmail.com',       role: Role.MEMBER,     gender: Gender.MALE   },
  { username: 'devops_nam',   display_name: 'Nam DevOps',        email: 'devopsnam@gmail.com',     role: Role.MEMBER,     gender: Gender.MALE   },
  { username: 'ai_enthusiast',display_name: 'AI Enthusiast VN',  email: 'aienthusiast@gmail.com',  role: Role.MEMBER,     gender: Gender.OTHER  },
  { username: 'huy_bkhn',     display_name: 'Huy BKHN',          email: 'huybkhn@gmail.com',       role: Role.MEMBER,     gender: Gender.MALE   },
];

// ─── Lĩnh vực (Sections) ──────────────────────────────────────────────────

const SECTIONS = [
  { name: 'Phần Cứng & Kỹ Thuật', display_order: 1 },
  { name: 'Phần Mềm & Lập Trình', display_order: 2 },
  { name: 'Công Nghiệp & Chế Tạo', display_order: 3 },
];

// ─── Nội dung diễn đàn ──────────────────────────────────────────────────────

const CATEGORIES = [
  {
    name: 'Build PC', slug: 'build-pc',
    sectionName: 'Phần Cứng & Kỹ Thuật',
    description: 'Thảo luận về linh kiện, cấu hình, và kinh nghiệm build PC từ A-Z.',
    display_order: 1,
    threads: [
      {
        title: 'So sánh RTX 5070 vs RX 9070 XT: Nên chọn card nào trong tầm giá 15 triệu?',
        posts: [
          'RTX 5070 hiệu năng rất tốt nhưng giá cao hơn. Nếu bạn dùng DLSS 4 nhiều thì nên chọn Nvidia.',
          'RX 9070 XT giá rẻ hơn khoảng 1.5 triệu, rasterization tương đương. Mình đang dùng rất hài lòng.',
          'Phụ thuộc vào màn hình bạn dùng. 1440p thì 9070 XT đủ dùng. 4K thì RTX 5070 nhỉnh hơn một chút.',
          'Đừng quên xét cả đến nguồn điện. RTX 5070 cần nguồn 750W trở lên để ổn định.',
          'Mình vừa build xong với RX 9070 XT + R7 9700X, nhiệt độ tốt, game 1440p max setting mượt lắm.',
        ],
      },
      {
        title: 'Cấu hình PC làm việc văn phòng + render video tầm 20 triệu',
        posts: [
          'Với 20 triệu, mình nghĩ: R7 9700X + B650 + 32GB DDR5 + RTX 4060 + 1TB SSD NVMe là ổn.',
          'Nếu render video là chính thì nên đầu tư nhiều hơn vào CPU và RAM. RX 7600 XT đủ cho văn phòng.',
          'Đừng tiết kiệm SSD. Mình đang dùng WD Black SN850X, tốc độ đọc ghi ảnh hưởng rất nhiều đến tiến độ render.',
          'RAM 32GB là tối thiểu nếu dùng Premiere Pro hay DaVinci Resolve với footage 4K.',
        ],
      },
      {
        title: 'CPU Intel Core Ultra 7 265K có đáng mua trong 2025 không?',
        posts: [
          'Mình đang dùng Core Ultra 7 265K, gaming rất tốt nhưng ở workload đa nhân thì thua R7 9700X.',
          'Kiến trúc Intel Arrow Lake còn nhiều vấn đề về hiệu năng đơn nhân. AMD đang chiếm lợi thế rõ ràng.',
          'Nếu bạn đã có bo mạch Intel và muốn nâng cấp thì 265K là lựa chọn hợp lý. Còn đầu tư mới thì nên chọn AMD.',
        ],
      },
    ],
  },
  {
    name: 'Kỹ Thuật', slug: 'ky-thuat',
    sectionName: 'Phần Cứng & Kỹ Thuật',
    description: 'Góc trao đổi về kỹ thuật phần cứng, điện tử, và điện công nghiệp.',
    display_order: 2,
    threads: [
      {
        title: 'Hướng dẫn đọc sơ đồ điện tử cơ bản cho người mới',
        posts: [
          'Ký hiệu điện trở (R), tụ điện (C), cuộn cảm (L) là 3 thứ căn bản nhất cần nhớ trước tiên.',
          'Nên học song song vừa đọc sơ đồ vừa thực hành trên breadboard. Lý thuyết không thôi không đủ.',
          'Mình hay dùng phần mềm KiCad để vẽ sơ đồ và mô phỏng trước khi làm thật, rủi ro thấp hơn nhiều.',
          'Transistor BJT và MOSFET là hai loại linh kiện ban đầu rất dễ nhầm lẫn. Nên tìm hiểu kỹ nguồn phân cực.',
        ],
      },
      {
        title: 'So sánh giao thức I2C, SPI và UART: Khi nào dùng loại nào?',
        posts: [
          'UART đơn giản nhất, point-to-point, không cần clock chung. Dùng để giao tiếp với module GPS, Bluetooth.',
          'SPI nhanh hơn cả, full-duplex, nhưng cần nhiều chân hơn và mỗi slave cần một chân CS riêng.',
          'I2C dùng chỉ 2 dây (SDA, SCL), có thể gắn nhiều thiết bị trên cùng bus. Tốc độ chậm hơn SPI.',
        ],
      },
    ],
  },
  {
    name: 'Lập Trình', slug: 'lap-trinh',
    sectionName: 'Phần Mềm & Lập Trình',
    description: 'Khu vực dành cho lập trình viên, sinh viên CNTT trao đổi kinh nghiệm và kiến thức.',
    display_order: 3,
    threads: [
      {
        title: 'Next.js 15 App Router vs Pages Router: Nên học theo hướng nào trong 2025?',
        posts: [
          'App Router là tương lai của Next.js. Vercel đang đầu tư rất nhiều vào đó và Pages Router sẽ dần bị deprecated.',
          'Nhưng nếu bạn vào công ty mà codebase đang dùng Pages Router thì vẫn phải biết cả hai.',
          'Điểm khó nhất của App Router là hiểu rõ Server Components vs Client Components. Mình mất 2 tuần mới nắm.',
          'Server Actions là tính năng rất tiện, thay thế được phần lớn API routes đơn giản. Nhưng cần cẩn thận bảo mật.',
        ],
      },
      {
        title: 'MongoDB vs PostgreSQL: Chọn database nào cho dự án web năm 2025?',
        posts: [
          'MongoDB phù hợp khi schema hay thay đổi, dữ liệu dạng document. PostgreSQL khi cần quan hệ chặt chẽ và ACID.',
          'Nếu dùng Next.js fullstack, MongoDB với Mongoose rất dễ tích hợp. Prisma + PostgreSQL cũng rất tốt.',
          'Vector search trong MongoDB Atlas khá hay cho các tính năng AI/semantic search hiện đại.',
        ],
      },
      {
        title: 'TypeScript strict mode: Có nên bật và lợi hại như thế nào?',
        posts: [
          'Nên bật từ đầu dự án. Bật muộn thì dọn dẹp lỗi rất mệt, đặc biệt với codebase lớn.',
          '"strict" bật chủ yếu: strictNullChecks, noImplicitAny, strictFunctionTypes. Mỗi cái giúp bắt lỗi runtime khác nhau.',
          'Kết hợp strict + eslint @typescript-eslint rules là bộ đôi rất hiệu quả để giữ code quality.',
        ],
      },
    ],
  },
  {
    name: 'Máy Móc', slug: 'may-moc',
    sectionName: 'Công Nghiệp & Chế Tạo',
    description: 'Thảo luận về máy móc công nghiệp, cơ khí, và tự động hóa.',
    display_order: 4,
    threads: [
      {
        title: 'Tổng quan về PLC Siemens S7-1200: Có nên học nó để làm tự động hóa không?',
        posts: [
          'S7-1200 là dòng PLC phổ biến nhất trong công nghiệp vừa và nhỏ tại Việt Nam. Học là đúng hướng.',
          'TIA Portal là phần mềm lập trình. Có bản Student 30 ngày free. Sau đó cần crack hoặc mua license.',
          'Ngôn ngữ lập trình chính: Ladder Diagram (LAD) và Function Block Diagram (FBD). LAD trực quan và dễ bắt đầu hơn.',
        ],
      },
      {
        title: 'Robot công nghiệp FANUC vs ABB: Đặc điểm và ứng dụng của từng dòng',
        posts: [
          'FANUC chiếm thị phần lớn nhất toàn cầu, giao diện TEACH PENDANT đơn giản, độ bền nổi tiếng.',
          'ABB mạnh ở ứng dụng hàn và phun sơn, phần mềm RobotStudio offline rất tốt để lập trình và mô phỏng trước.',
          'Ngôn ngữ lập trình: FANUC dùng TP/Karel, ABB dùng RAPID. Khác nhau nhưng logic tương tự.',
        ],
      },
    ],
  },
  {
    name: 'Công Nghệ Khác', slug: 'cong-nghe-khac',
    description: 'Thiết bị thông minh, AI, IoT, và mọi công nghệ mới thú vị khác.',
    display_order: 5,
    threads: [
      {
        title: 'Trải nghiệm sau 3 tháng dùng nhà thông minh: Đáng đầu tư không?',
        posts: [
          'Mình dùng hệ sinh thái Matter (Apple Home + Google Home). Thiết bị tương thích khá nhiều rồi năm 2025.',
          'Bắt đầu đơn giản: smart bulb, smart plug là ổn. Đừng đầu tư hết vào một ecosystem ngay từ đầu.',
          'Home Assistant + Zigbee dongle là combo tốt nhất cho người muốn tự kiểm soát mà không phụ thuộc cloud.',
        ],
      },
      {
        title: 'Làm quen với AI tools trong công việc kỹ thuật: ChatGPT, Copilot và Gemini',
        posts: [
          'GitHub Copilot thực sự tiết kiệm thời gian viết boilerplate code đáng kể. Đặc biệt là TypeScript interfaces.',
          'ChatGPT hay Gemini rất tốt để giải thích lỗi, giải thích concept, brainstorm solution.',
          'AI viết code tốt nhưng hay tự tin vào những gì nó không biết. Phải verify kỹ, đặc biệt về bảo mật.',
          'Cursor IDE tích hợp AI codebase-aware, hay hơn Copilot khi làm việc với dự án lớn có nhiều file liên quan.',
        ],
      },
      {
        title: 'Bắt đầu với ESP32 và MQTT: Dự án IoT đơn giản giám sát nhiệt độ, độ ẩm',
        posts: [
          'ESP32 + cảm biến DHT22 + MQTT broker Mosquitto là combo kinh điển để học IoT thực tế.',
          'Dùng broker miễn phí HiveMQ hoặc EMQX Cloud để test. Production thì nên tự host Mosquitto trên VPS.',
          'Kết hợp với Node-RED để tạo flow xử lý dữ liệu và dashboard trực quan. Không cần viết backend phức tạp.',
        ],
      },
    ],
  },
];

// ─── Main seed function ───────────────────────────────────────────────────────

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Đã kết nối MongoDB');

    // 1. Xóa toàn bộ dữ liệu cũ
    console.log('🗑️  Đang xóa dữ liệu cũ...');
    await Promise.all([
      User.deleteMany({}),
      Section.deleteMany({}),
      Category.deleteMany({}),
      Thread.deleteMany({}),
      Post.deleteMany({}),
      Like.deleteMany({}),
    ]);
    console.log('✨ Đã xóa xong.');

    // 2. Tạo users
    console.log('👥 Tạo users...');
    const passwordHash = await bcrypt.hash('koz123456', 10);

    const createdUsers = await User.insertMany(
      USERS.map(u => ({
        username:     u.username,
        display_name: u.display_name,
        email:        u.email,
        password_hash: passwordHash,
        status:       UserStatus.ACTIVE,
        role:         u.role,
        gender:       u.gender,
        bio:          '',
      }))
    );
    console.log(`✅ Tạo ${createdUsers.length} users.`);
    console.log('');
    console.log('📋 Tài khoản đặc biệt (mật khẩu: koz123456):');
    USERS.filter(u => u.role !== Role.MEMBER).forEach(u => {
      console.log(`   [${u.role.toUpperCase()}] ${u.username} — ${u.email}`);
    });
    console.log('');

    // Chỉ dùng member để post
    const members = createdUsers.filter(u => (u as any).role === Role.MEMBER);
    const randomMember = () => members[Math.floor(Math.random() * members.length)];

    // 3. Tạo sections
    console.log('📦 Tạo sections...');
    const createdSections = await Section.insertMany(SECTIONS);
    const sectionMap: Record<string, string> = {};
    createdSections.forEach(s => sectionMap[s.name] = s._id.toString());
    console.log(`✅ Tạo ${createdSections.length} sections.`);

    // 4. Tạo categories, threads, posts, likes
    for (const catData of CATEGORIES) {
      const category = await Category.create({
        name:          catData.name,
        slug:          catData.slug,
        description:   catData.description,
        display_order: catData.display_order,
        section_id:    (catData as any).sectionName ? sectionMap[(catData as any).sectionName] : null,
      });
      console.log(`📁 [${category.name}]${(catData as any).sectionName ? ` (in ${catData.sectionName})` : ' (Khác)'}`);

      for (const threadData of catData.threads) {
        const slug = threadData.title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
          .substring(0, 80)
          + '-' + (Date.now() % 100000);

        const thread = await Thread.create({
          title:       threadData.title,
          slug,
          category_id: category._id,
          author_id:   randomMember()._id,
          view_count:  Math.floor(Math.random() * 2000) + 50,
          status:      ThreadStatus.ACTIVE,
        });

        const createdPosts = [];
        for (const content of threadData.posts) {
          const post = await Post.create({
            thread_id: thread._id,
            author_id: randomMember()._id,
            content,
          });
          createdPosts.push(post);
        }

        // Likes ngẫu nhiên cho từng post
        for (const post of createdPosts) {
          const numLikes = Math.floor(Math.random() * 8) + 1;
          const likers = [...createdUsers]
            .sort(() => 0.5 - Math.random())
            .slice(0, numLikes);
          await Like.insertMany(
            likers.map(u => ({ user_id: u._id, post_id: post._id }))
          );
        }

        console.log(`  ✅ "${threadData.title.substring(0, 55)}..."`);
      }
    }

    console.log('\n🎉 Seed hoàn tất!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi khi seed:', err);
    process.exit(1);
  }
}

seed();
