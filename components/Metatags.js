import Head from 'next/head';

export default function Metatags({
  title = 'Dev 2.0: Clone ',
  description = 'A Clone Of Dev 2.0',
  image = 'https://firebasestorage.googleapis.com/v0/b/nextjs-demo-app-78181.appspot.com/o/Screenshot%202021-09-09%20215349.png?alt=media&token=fded8200-54d8-4f96-8a43-7beb40873818',
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@fireship_dev" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  );
}
