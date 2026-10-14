import { Brand, Arrow } from "@/components/icons";
export default function Credits() {
  return (
    <>
      <header className="simple-header">
        <Brand />
        <a href="/" className="text-link">
          Back to the journey <Arrow />
        </a>
      </header>
      <main id="main" className="document-page">
        <span className="eyebrow">THE PEOPLE BEHIND THE PICTURES</span>
        <h1>IN GOOD LIGHT.</h1>
        <p className="document-lead">
          Sport photography brings this journey to life.
        </p>
        <ul className="credits-list">
          <li>
            <a href="https://unsplash.com/photos/person-running-on-road-at-daytime-QVD3Xht9txA">
              Opening photograph — Andrea Leopardi
            </a>
          </li>
          <li>
            <a href="https://unsplash.com/photos/person-swimming-on-blue-sea-during-daytime-aezJk92dIsM">
              Swimming — billow926
            </a>
          </li>
          <li>
            <a href="https://unsplash.com/photos/cyclists-race-on-a-road-with-motion-blur-XmlEVg-1nRk">
              Cycling — charlie dt
            </a>
          </li>
          <li>
            <a href="https://unsplash.com/photos/unknown-person-running-on-road-5DykCHKRm5Q">
              Running — Laura Ghise
            </a>
          </li>
        </ul>
        <p>
          These illustrative sport photographs are used under the{" "}
          <a href="https://unsplash.com/license">Unsplash License</a>. They do
          not depict coach Shreeshail or his athletes. The coach poster was
          supplied for this website.
        </p>
      </main>
    </>
  );
}
