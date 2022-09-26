import fs from 'fs';
import matter from 'gray-matter';
import Link from 'next/link';

export async function getStaticProps() {
  const files = fs.readdirSync('docs');

  const docs = files.map((fileName) => {
    const slug = fileName.replace('.md', '');
    const readFile = fs.readFileSync(`docs/${fileName}`, 'utf-8');
    const { data: frontmatter } = matter(readFile);
    return {
      slug,
      frontmatter,
    };
  });

  return {
    props: {
      docs,
    },
  };
}


// export default function Docs({ docs }) {
//   return (
//     <div className='font-jetbrains'>
//       {docs.map(({ slug, frontmatter }) => (
//         <div
//           key={slug}
//           className='border-b border-gray-dark m-2'
//         >
//           <Link href={`/doc/${slug}`}>
//             <a>
//               <h1 className='capitalize text-xl px-4 text-white'>{frontmatter.title}</h1>
//             </a>
//           </Link>
//           <span className="px-4 text-boring-white dark:text-boring-black text-sm">{frontmatter.date}</span>
//           <p className="px-4 pb-4 text-boring-white text-xs">{frontmatter.metaDesc}</p>
//         </div>
//       ))}
//     </div>
//   );
// }
