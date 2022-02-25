import { getSortedPostsData } from "static/changelog";

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
      {props.allPostsData.map(({ id, date, title }) => (
        <li className="" key={id}>
          {title} {"//"} {id} {"//"} {date}
        </li>
      ))}
    </ul>
  );
}
