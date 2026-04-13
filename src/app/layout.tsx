import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, InitColorSchemeScript } from "@mui/material";
import theme from "@/lib/theme";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
import { getSections } from "@/actions/section.actions";

export const metadata: Metadata = {
  title: "KOZ Forum",
  description:
    "Cộng đồng chia sẻ kiến thức bổ ích về công nghệ, kỹ thuật, máy tính,... và hơn thế nữa",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user || null;
  const sections = await getSections();

  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <InitColorSchemeScript
          defaultMode="light"
          attribute="data-mui-color-scheme"
          modeStorageKey="koz-theme-mode"
        />
      </head>
      <body>
        <SessionProvider>
          <AppRouterCacheProvider>
            <ThemeProvider
              theme={theme}
              defaultMode="light"
              modeStorageKey="koz-theme-mode"
              disableTransitionOnChange
            >
              <CssBaseline />
              <Header user={user} sections={sections} />
              <main>{children}</main>
              <Footer />
            </ThemeProvider>
          </AppRouterCacheProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
