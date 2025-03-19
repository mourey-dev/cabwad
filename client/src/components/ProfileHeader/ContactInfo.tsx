// Assets
import Phone from "../../assets/images/contact-phone.png";
import Email from "../../assets/images/contact-email.png";

// Utils
import { getValidDisplay } from "../../utils/dataHandler";

type ContactInfoProps = {
  phone: string;
  email: string;
};

const ContactInfo = ({ phone, email }: ContactInfoProps) => {
  return (
    <div className="mt-2 flex items-center space-x-4">
      <span className="text-blue flex items-center gap-2">
        <img src={Phone} alt="Phone" className="h-4 w-4" />
        {getValidDisplay(phone)}
      </span>
      <span className="text-blue flex items-center gap-2">
        <img src={Email} alt="Email" className="h-4 w-4" />
        {getValidDisplay(email)}
      </span>
    </div>
  );
};
export default ContactInfo;
