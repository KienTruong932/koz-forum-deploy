import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 4, textAlign: 'justify' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1.5 }}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {children}
      </Typography>
    </Box>
  );
}
export default function AboutPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }} color="primary">
        Giới thiệu về KOZ
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Cộng đồng công nghệ dành cho những người đam mê học hỏi và chia sẻ
      </Typography>

      <Divider sx={{ mb: 4 }} />

      <Section title="KOZ là gì?">
        KOZ (Knowledge-Over-Zero) là một diễn đàn công nghệ Việt Nam được xây dựng để kết nối những người yêu thích
        công nghệ từ sinh viên IT, kỹ sư phần cứng, lập trình viên cho đến những người đam mê các món đồ công nghệ
        Tại đây, bạn có thể đặt câu hỏi, chia sẻ kinh nghiệm, thảo luận về các chủ đề về PC, lập trình,
      </Section>

      <Section title="Lịch sử ra đời">
        KOZ được tạo bởi sinh viên Trương Trung Kiên thuộc trường Đại Học An Giang với mong muốn tạo ra một nơi
        trao đổi kỹ thuật chuyên sâu trên không gian mạng, đồng thời xây dựng một nền tảng mở, nơi mọi thảo luận đều
        được cộng đồng kiểm soá và đóng góp.
      </Section>

      <Section title="Sứ mệnh">
        Chúng tôi tin rằng kiến thức cần được chia sẻ tự do. KOZ hướng đến việc:
        <Box component="ul" sx={{ mt: 1, pl: 3 }}>
          <li>Cung cấp không gian thảo luận kỹ thuật nghiêm túc và thân thiện</li>
          <li>Hỗ trợ người mới bắt đầu học công nghệ có chỗ hỏi đáp đáng tin cậy</li>
          <li>Kết nối các chuyên gia và người học trong cùng một cộng đồng</li>
          <li>Xây dựng kho tri thức công nghệ tiếng Việt phong phú</li>
        </Box>
      </Section>

      <Section title="Đội ngũ phát triển">
        KOZ được phát triển và duy trì bởi cá nhân Trương Trung Kiên. Dự án sử dụng Next.js, MongoDB và Auth.js
        làm nền tảng kỹ thuật chính.
      </Section>

      <Section title="Liên hệ">
        Nếu bạn muốn đóng góp, báo lỗi hoặc đề xuất tính năng, hãy gửi email về:{' '}
        <Typography component="span" color="primary">
          truongtrungkien030902@gmail.com
        </Typography>
        {'. '}
        Tôi luôn chào đón sự đóng góp từ cộng đồng!
      </Section>
    </Container>
  );
}

