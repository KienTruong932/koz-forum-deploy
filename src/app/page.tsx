import { getCategoriesBySectionId } from "@/actions/category.actions";
import { getSections } from "@/actions/section.actions";
import { getHotThreads, getRecentThreads } from "@/actions/thread.actions";
import { Container, Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import CategoryCard from "@/components/main/CategoryCard";
import HomeSidebar from "@/components/main/HomeSidebar";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [sections, hotThreads, recentThreads] = await Promise.all([
    getSections(),
    getHotThreads(3),
    getRecentThreads(5),
  ]);

  const sectionsWithCategories = await Promise.all(
    sections.map(async (section: any) => {
      const cats = await getCategoriesBySectionId(section._id.toString());
      return {
        ...section,
        categories: cats,
      };
    }),
  );

  const categoriesWithoutSection = await getCategoriesBySectionId(null);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold" }}
        color="primary"
      >
        KOZ - Forum dành cho anh em đam mê công nghệ
      </Typography>
      <Typography variant="subtitle1" color="secondary" sx={{ mb: 4 }}>
        Hãy thỏa thích sáng tạo và chia sẻ kiến thức của bạn với cộng đồng.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box>
            {sectionsWithCategories.map((section) => {
              if (section.categories.length === 0) return null;

              return (
                <Box key={section._id.toString()} id={`section-${section._id}`} sx={{ mb: 4 }}>
                  <Typography
                    variant="h5"
                    color="primary"
                    sx={{
                      mb: 2,
                      fontWeight: "bold",
                      pl: 1,
                      borderLeft: "4px solid",
                      borderColor: "inherit",
                    }}
                  >
                    {section.name}
                  </Typography>
                  <Box>
                    {section.categories.map((cat: any) => (
                      <CategoryCard key={cat._id.toString()} category={cat} />
                    ))}
                  </Box>
                </Box>
              );
            })}

            {categoriesWithoutSection.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h5"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    fontWeight: "bold",
                    pl: 1,
                    borderLeft: "4px solid",
                    borderColor: "text.secondary",
                  }}
                >
                  Khác
                </Typography>
                <Box>
                  {categoriesWithoutSection.map((cat: any) => (
                    <CategoryCard key={cat._id.toString()} category={cat} />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <HomeSidebar hotThreads={hotThreads} recentThreads={recentThreads} />
        </Grid>
      </Grid>
    </Container>
  );
}
