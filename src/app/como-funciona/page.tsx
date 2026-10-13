import { EditorialPage, editorialMetadata } from "@/components/site/editorial-page";

export const revalidate = 300;
export const generateMetadata = () => editorialMetadata("como-funciona");

export default function Page() {
  return <EditorialPage slug="como-funciona" />;
}
