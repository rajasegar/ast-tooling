import Split from "split.js";

export default function () {
  Split(["#split-0", "#split-1"]);
  Split(["#split-01", "#split-02"], {
    direction: "vertical",
  });
}
