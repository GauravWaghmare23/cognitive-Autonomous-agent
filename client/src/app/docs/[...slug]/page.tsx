import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getDocBySlug, getAllSlugs } from "@/lib/docs/registry";
import { getPrevNext } from "@/lib/docs/nav";
import { DocRenderer } from "@/components/docs/DocRenderer";
import { TableOfContents } from "@/components/docs/TableOfContents";
import { PrevNextNav } from "@/components/docs/PrevNextNav";

interface DocPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({
    slug: slug.split("/"),
  }));
}

export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug(slug);

  if (!doc) {
    return {
      title: "Doc Not Found — Cognivex Docs",
    };
  }

  return {
    title: `${doc.title} — Cognivex Documentation`,
    description: doc.description,
  };
}

export default async function DynamicDocPage({ params }: DocPageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  const slugString = slug.join("/");
  const { prev, next } = getPrevNext(slugString);

  // Extract headings for Table of Contents
  const headings = doc.blocks
    .filter((b): b is { type: "heading"; level: 2 | 3; text: string; id: string } => b.type === "heading")
    .map((b) => ({
      level: b.level,
      text: b.text,
      id: b.id,
    }));

  return (
    <div className="flex w-full items-start gap-12">
      {/* Center content column */}
      <article className="min-w-0 max-w-3xl flex-1 pb-16">
        {/* Page header */}
        <header className="mb-8 border-b border-zinc-200 pb-6">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 font-mono">
            {doc.group}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            {doc.title}
          </h1>
          <p className="mt-3 text-base text-zinc-600 leading-relaxed">
            {doc.description}
          </p>
        </header>

        {/* Render Doc blocks */}
        <DocRenderer blocks={doc.blocks} />

        {/* Prev / Next navigation */}
        <PrevNextNav prev={prev} next={next} />
      </article>

      {/* Right Table of Contents */}
      <TableOfContents headings={headings} />
    </div>
  );
}
