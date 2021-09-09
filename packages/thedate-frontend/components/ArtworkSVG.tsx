export default function ArtworkSVG({ dateString, noteString }: { dateString: string, noteString: string }) {
  let wordwrapped = noteString.replace(/(?![^\n]{1,60}$)([^\n]{1,60})\s/g, '$1\n').split('\n');
  console.log(wordwrapped[0]);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" 
      preserveAspectRatio="xMinYMin meet" baseProfile="tiny" viewBox="0 0 500 500">
      <rect width="100%" height="100%" fill="black" />
      <text x="50%" y="50%" fontSize="50px" fill="white" fontFamily="monospace" dominantBaseline="middle" textAnchor="middle">
        {dateString}
      </text>
      {wordwrapped[0] && 
      <text x="50%" y="90%" fontSize="10px" fill="white" fontFamily="monospace" dominantBaseline="middle" textAnchor="middle">
        {wordwrapped[0]}
      </text>}
      {wordwrapped[1] && 
      <text x="50%" y="93%" fontSize="10px" fill="white" fontFamily="monospace" dominantBaseline="middle" textAnchor="middle">
        {wordwrapped[1]}
      </text>}
      {wordwrapped[2] && 
      <text x="50%" y="96%" fontSize="10px" fill="white" fontFamily="monospace" dominantBaseline="middle" textAnchor="middle">
        {wordwrapped[2]}
      </text>}
    </svg>
  );
}