import Link from 'next/link';

export default function ArtworkProfile() {
  return (
    <div className="hero py-20">
      <div className="hero-content flex flex-wrap flex-row space-x-4">
        <div className="flex-none h-96 w-96">

        </div> 
        <div className="flow-grow"> 
          <div>
            <p>Note: {artwork.note}</p>
            <p>Owner: {artwork.owner}</p>
            <p>Last Price: {artwork.price}</p>
          </div>
        </div> 
      </div> 
    </div>
  );
}
