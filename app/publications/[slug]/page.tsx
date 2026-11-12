import { notFound } from "next/navigation";
import { allPublications } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import { Header } from "./header";
import "./mdx.css";
import { ReportView } from "./view";

export const revalidate = 60;

type Props = {
  params: {
    slug: string;
  };
};


export async function generateStaticParams(): Promise<Props["params"][]> {
  return allPublications
    .filter((b) => b.published)
    .map((b) => ({
      slug: b.slug,
    }));
}

export default async function PostPage({ params }: Props) {
  const slug = params?.slug;
  const publication = allPublications.find((publication) => publication.slug === slug);

  if (!publication) {
    notFound();
  }

  const views =
    (["pageviews", "publication", slug].join(":")) ?? 0;

  return (
    <div className="bg-zinc-50 min-h-screen">
      <Header publication={publication}/>
      <ReportView slug={publication.slug} />

      <article className="px-4 py-12 mx-auto prose prose-zinc prose-quoteless">
        <Mdx code={publication.body.code} />
      </article>
    </div>
  );
}
