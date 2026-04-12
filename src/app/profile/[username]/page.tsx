import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getUserProfileByUsername } from '@/actions/user.actions';
import { Container, Box, Typography, Card, CardContent, Avatar, Divider } from '@mui/material';

import ProfileEditForm from '@/components/profile/ProfileEditForm';
import PasswordChangeForm from '@/components/profile/PasswordChangeForm';
import ModRestrictButton from '@/components/profile/ModRestrictButton';
import AdminBanButton from '@/components/profile/AdminBanButton';
import { Gender, Role } from '@/lib/enums';

type PageProps = {
  params: Promise<{ username: string }>;
};

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;
  const session = await auth();
  const profile = await getUserProfileByUsername(username);

  if (!profile) {
    return notFound();
  }

  const isOwner = session?.user?.username === username;
  const role = session?.user?.role;
  const isModOrAdmin = role === Role.MODERATOR || role === Role.ADMIN;
  const isAdmin = role === Role.ADMIN;
  const hasPassword = profile.password_hash !== 'GOOGLE_OAUTH_NO_PASSWORD';

  const joinDate = profile.created_at ? new Intl.DateTimeFormat('vi-VN').format(new Date(profile.created_at)) : 'N/A';

  return (
    <>
      {isOwner ? (
        <Container maxWidth="md" sx={{ my: 10 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Chỉnh sửa hồ sơ
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" color="text.secondary">Email: {profile.email}</Typography>
                <Typography variant="body1">Tên đăng nhập: {profile.username} </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />

              <ProfileEditForm user={profile} />

              <PasswordChangeForm hasPassword={hasPassword} />
            </CardContent>
          </Card>
        </Container>
      ) : (
        <Container maxWidth="sm" sx={{ my: 10 }}>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Avatar src={profile.avatar} sx={{ width: 120, height: 120, mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {profile.display_name}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                @{profile.username}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, fontStyle: 'italic' }}>
                {profile.bio || "Không muốn nói nhiều về bản thân"}
              </Typography>
            </CardContent>
            <Divider />
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1" color="text.secondary">Giới tính:</Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  {profile.gender === Gender.MALE ? 'Nam' : profile.gender === Gender.FEMALE ? 'Nữ' : 'Khác'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1" color="text.secondary">Ngày tham gia:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{joinDate}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1" color="text.secondary"> Tổng Threads:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{profile.threadsCount || 0}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1" color="text.secondary">Tổng bài đăng:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{profile.postsCount || 0}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1" color="text.secondary">Lượt thích:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{profile.likesCount || 0}</Typography>
              </Box>
              {isModOrAdmin && !isOwner && (
                <Box sx={{ pt: 1, display: 'flex', alignItems: 'center' }}>
                  <ModRestrictButton username={profile.username} currentStatus={profile.status} />
                  {isAdmin && <AdminBanButton username={profile.username} currentStatus={profile.status} />}
                </Box>
              )}
            </CardContent>
          </Card>
        </Container>
      )}
    </>
  );
}