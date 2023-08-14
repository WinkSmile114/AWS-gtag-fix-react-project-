import './index.css';
import iconOne from '../common-icons/footer-icon-one.png';
import iconTwo from '../common-icons/footer-icon-two.png';
import iconThree from '../common-icons/footer-icon-three.png';
import tmIcon from '../common-icons/tm-icon.png';

interface FooterProps {
  page?: string;
}
export default (props: FooterProps) => {
  return (
    <>
      <div
        className={
          'footer-container' + (props.page ? ' ' + props.page : '')
        }
      >
        <img
          className="actual-logo"
          src="/white-logo-new.svg"
          alt="image"
        />
        <div id="report-an-issue">
          <p>
            To report a security issue with our web application or with
            process, please email security@payrofinance.com.
          </p>
          <p>
            To inform us of a technical issue or general questions,
            please use the chat feature or call us at 1-833-271-4499
          </p>
        </div>
        <div id="legal-policy-links">
          <p id="legal-policies-title">Legal Policies</p>
          <a
            target="_blank"
            href="https://media.payrofinance.com/policies/PrivacyPolicy.pdf"
            rel="noreferrer"
          >
            Privacy Policy
          </a>
        </div>
        <div id="footer-bottom">
          <div className="footer-text">
            <p className="actual-text">
              Loan approval is not guaranteed. Approvals are based
              upon Payro’s proprietary scoring and underwriting
              system's review of your credit, financial condition,
              other factors, and supporting documents or information
              you provide.
            </p>
            <p className="actual-text">
              The information provided through payro™ does not
              constitute legal, tax, financial or accounting advice,
              and should not be considered a substitute for obtaining
              competent personalized advice from a licensed
              professional. You should seek professional advice before
              making any decision that could affect the financial
              health of your business. {' '}
            </p>
            <p className="actual-text">
              To help the government fight the funding of terrorism
              and money laundering activities, Federal law requires
              all financial institutions to obtain, verify, and record
              information that identifies each person and business
              that seeks a business loan. What this means for you:
              When you apply for a loan, we will ask for your business
              name, address, and Tax Identification Number. We will
              also ask for your name, address, date of birth, and
              other information that will allow us to identify you.
            </p>
          </div>

          <div className="bold-container">
            <p className="bold-text">
              Pay your staff on time
              {/* <img
                className="footer-icon-tm"
                src={tmIcon}
                alt="image"
                width={20}
                height={20}
              /> */}
            </p>
          </div>
          {/* <div className="icons-container">
            <img
              className="footer-icon-one"
              src={iconThree}
              alt="image"
              width={86.04}
              height={24.58}
            />
          </div> */}
        </div>
      </div>
    </>
  );
};
