import Link from "next/link";
import { getSortedPostsData } from "static-build/guides";

interface StaticProps {
  allPostsData: { id: string; date: string; title: string }[];
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
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
