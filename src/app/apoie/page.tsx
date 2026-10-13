import { EditorialPage, editorialMetadata } from "@/components/site/editorial-page";

export const revalidate = 300;
export const generateMetadata = () => editorialMetadata("apoie");

export default function Page() {
  return <EditorialPage slug="apoie" />;
}
