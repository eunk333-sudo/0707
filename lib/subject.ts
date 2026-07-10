// Strips the "01"/"02" dedup-numbering suffix that getNextSavedTitle appends,
// so repeated saves of the same card can be grouped/matched by subject.
export function subjectOf(title: string) {
  return title.replace(/\s+\d{2}$/u, "").trim() || title;
}
