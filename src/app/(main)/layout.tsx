import Header from "@/components/layout/Header";
import { getCurrentSession } from "@/actions/auth";
import HeaderCategorySelector from "@/components/layout/HeaderCategorySelector";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getCurrentSession();
  return (
    <main>
      <Header user={user} categorySelector={<HeaderCategorySelector />} />
      {children}
    </main>
  );
}
