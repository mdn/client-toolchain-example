import Plotly from "plotly.js-dist-min";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import styles from "./App.module.css";

const queryClient = new QueryClient();

function renderGraph(root, data) {
  const layout = {
    title: `Commits to the mdn/content repo (${new Date(data[0].week * 1000).toLocaleDateString()} - ${new Date(data[data.length - 1].week * 1000).toLocaleDateString()})`,
    xaxis: {
      title: "Week",
      showgrid: true,
      zeroline: false,
      tickformat: "%Y-%m-%d",
    },
    yaxis: {
      title: "Commits",
      showline: false,
    },
  };
  const line = {
    x: data.map((d) => new Date(d.week * 1000)),
    y: data.map((d) => d.total),
    text: data.map((d) => `${d.total} commits`),
  };
  Plotly.newPlot(root, [line], layout);
}

function renderGrid(root, data) {
  const layout = {
    title: `Commits to the mdn/content repo, by day`,
    height: 350,
  };
  const zValues = Array.from({ length: 7 }, () => []);
  data.forEach((d) => {
    d.days.forEach((value, i) => {
      zValues[i].push(value);
    });
  });
  const grid = {
    z: zValues,
    y: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    x: data.map((d) => new Date(d.week * 1000)),
    type: 'heatmap',
  };
  Plotly.newPlot(root, [grid], layout);
}

function Example() {
  const { isPending, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: () =>
      fetch(
        "https://api.github.com/repos/mdn/content/stats/commit_activity",
      ).then((res) => res.json()),
  });

  if (isPending) return "Loading...";

  if (error) return `An error has occurred: ${error}`;

  return (
    <main className={styles.container}>
    <h1 className={styles.title}>MDN Content repo commit activity</h1>
      <div
        ref={(root) => {
          if (!root) return;
          renderGraph(root, data);
        }}
      />
      <div
        ref={(root) => {
          if (!root) return;
          renderGrid(root, data);
        }}
      />
    </main>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
}
