import { Brand, Arrow } from "@/components/icons";
export default function Privacy() {
  return (
    <>
      <header className="simple-header">
        <Brand />
        <a href="/" className="text-link">
          Back to the journey <Arrow />
        </a>
      </header>
      <main id="main" className="document-page">
        <span className="eyebrow">TRI-SHAIL PERFORMANCE COACHING</span>
        <h1>YOUR PRIVACY.</h1>
        <p className="document-lead">
          Your enquiry is the beginning of a conversation. Here’s how your
          information is used.
        </p>
        <h2>Information you share</h2>
        <p>
          The coaching enquiry form collects your name, phone number, any email
          or goal you choose to provide, and your message. It records your
          consent to be contacted and the time of submission.
        </p>
        <h2>How it is used</h2>
        <p>
          Tri-Shail uses these details to review and respond to your coaching
          enquiry. They are not published on the website or sold. Please avoid
          including medical records or other sensitive information in the form.
        </p>
        <h2>Storage and protection</h2>
        <p>
          Enquiries are stored in a database hosted by Cloudflare and accessed
          by authorised people managing coaching enquiries. The website’s public
          visitors cannot read these records. Limited technical information may
          be processed to protect the form from spam and abuse.
        </p>
        <h2>Retention and your choices</h2>
        <p>
          You can ask Shreeshail to correct or delete your enquiry, or withdraw
          permission to be contacted, when he responds. Enquiry records should
          be retained only as long as needed for the coaching conversation.
        </p>
        <h2>Website technology</h2>
        <p>
          The site uses locally hosted fonts and photographs. No advertising
          trackers or visitor accounts are included in this version. Your
          browser’s reduced-motion preference is respected.
        </p>
        <p className="document-note">
          This preview policy must be finalised with a direct privacy contact
          and a specific retention period before public launch.
        </p>
        <a href="/#contact" className="button button-orange">
          Back to your enquiry <Arrow />
        </a>
      </main>
    </>
  );
}
