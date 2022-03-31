import Link from "next/link";
import { getSortedPostsData, guidesDirectory } from "static-build/guides";

interface StaticProps {
  allPostsData: { id: string; date: string; title: string }[];
}

// eslint-disable-next-line require-await
export async function getStaticProps() {
  const allPostsData = getSortedPostsData(guidesDirectory);
  return {
    props: {
      allPostsData: allPostsData.filter(
        (p) => p.id.startsWith("wip-") === false
      ),
    },
  };
}

export default function Blog(props: StaticProps) {
  return (
    <ul className="before:">
      {props.allPostsData.map(({ id, title }) => (
        <li className="" key={id}>
          <Link href={`/guides/${id}`}>
            <a>{title}</a>
          </Link>
        </li>
      ))}
    </ul>
  );
}
