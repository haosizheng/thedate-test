export default function ArtworkSVG({ dateString, noteString }: { dateString: string, noteString: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 500 500">
      <rect width="100%" height="100%" fill="black" />
      <text x="50%" y="50%" fontSize="50px" fill="white" fontFamily="monospace" dominantBaseline="middle" textAnchor="middle">
        {dateString}
      </text>
      {noteString &&<text x="50%" y="90%" fontSize="10px" fill="white" fontFamily="monospace" dominantBaseline="middle" textAnchor="middle">
        {noteString}
      </text>
      }
    </svg>
  );
}