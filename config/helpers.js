const nodemailer = require("nodemailer");
const Company = require("../model/Company");
const cron = require("node-cron");
const User = require("../model/User");
const Advert = require("../model/Advert");

const sendOnboardingEmail = (email, name, type) => {
     const startDate = new Date();
     const endDate = new Date();
     endDate.setDate(endDate.getDate() + 14);
     const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
     const formattedDate = (dt) => dt.toLocaleDateString("en-US", options);

     const transporter = nodemailer.createTransport({
          host: "smtp.office365.com",
          port: 587,
          secure: false,
          auth: {
               user: process.env.EMAIL,
               pass: process.env.PASSWORD,
          },
     });

     let subject, introMessage, benefitsMessage;

     if (type === "ecommerce") {
          subject = "Welcome to Our IMarketplace - Your Free Trial Period!";
          introMessage = `
            <p>We are thrilled to welcome you as a new vendor on our vibrant and dynamic ecommerce marketplace.</p>
            <p>We understand that getting started in a new marketplace can be both thrilling and challenging, and we want to support you every step of the way. That is why we are delighted to offer you a free two-week trial period to set up and review your ecommerce store.</p>
            <p>During this trial period, you will have ample time to familiarize yourself with our platform, showcase your products, and ensure that your store is a true reflection of your brand.</p>
       `;
          benefitsMessage = `
            <p><span class="highlight">Benefits of the Trial Period:</span></p>
            <ul>
              <li>Opportunity to create and customize your ecommerce store.</li>
              <li>Full access to our suite of tools and features.</li>
              <li>Upload and organize your products, descriptions, and images.</li>
              <li>Familiarize yourself with our user-friendly interface.</li>
              <li>Explore our robust marketing, promotional, and video training resources.</li>
              <li>Evaluate the effectiveness of our platform for your business.</li>
            </ul>
       `;
     } else if (type === "service") {
          subject = "Welcome to ImarketPlace Service - Your Free Trial Period!";
          introMessage = `
            <p>We are thrilled to welcome you to ImarketPlace Service, your partner in success and empowerment.</p>
            <p>Starting today, you have a free two-week trial period to explore the benefits of our consulting services. Take this time to set up your account, familiarize yourself with our expert consultants, and discover how Breaking Black can support and elevate your journey.</p>
       `;
          benefitsMessage = `
            <p><span class="highlight">Benefits of Registering with ImarketPlace:</span></p>
            <ul>
              <li>Access to a team of experienced and diverse consultants.</li>
              <li>Personalized consulting sessions tailored to your goals.</li>
              <li>Guidance in areas such as business strategy, career development, and personal empowerment.</li>
              <li>Exclusive access to workshops, webinars, and networking events.</li>
              <li>Opportunity to connect with a community of like-minded individuals and professionals.</li>
              <li>Regular updates on industry trends, diversity, and inclusion initiatives.</li>
            </ul>
       `;
     }

     const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: subject,
          html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          /* CSS styles for the email template */
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
  
          body {
            font-family: 'Montserrat', Arial, sans-serif;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
            border-radius: 5px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .message {
            margin-bottom: 20px;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
          }
          .highlight {
            font-weight: bold;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
          }
          .logo {
            display: block;
            margin: 0 auto;
            max-width: 200px;
          }
          .cta-button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
          }
          .cta-button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img class="logo" src="https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/logo.png" alt="Company Logo">
            <h1 style="color: #333333;">Welcome as a New ${
                 type === "ecommerce" ? "Vendor" : "Member"
            }!</h1>
          </div>
          <div class="message">
            <p>Dear ${name},</p>
            ${introMessage}
            <p>Here are some key details regarding your free trial period:</p>
            <ul>
              <li><span class="highlight">Trial Start Date:</span> ${formattedDate(startDate)}</li>
              <li><span class="highlight">Trial End Date:</span> ${formattedDate(endDate)}</li>
            </ul>
          </div>
          <hr style="border: none; border-top: 1px solid #dddddd; margin: 20px 0;">
          <div class="message">
            ${benefitsMessage}
          </div>
          <hr style="border: none; border-top: 1px solid #dddddd; margin: 20px 0;">
          <div class="message">
            <p>We realize that we, as people of color, are stronger together, and when we stand together, our possibilities are limitless.</p>
          </div>
          <div class="message">
            <p>Welcome aboard! If you have any questions or need further assistance, please do not hesitate to reach out to us. We are always here to help.</p>
            <a class="cta-button" href="https://example.com">Get Started</a>
          </div>
          <div class="footer">
            <p style="color: #777777;">This email was sent by Imarketplace, LLC. If you no longer wish to receive emails from us, please <a href="#" style="color: #777777; text-decoration: underline;">unsubscribe</a>.</p>
          </div>
        </div>
      </body>
      </html>
    `,
     };
     transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
               console.log(error);
          } else {
               console.log("Email sent: " + info.response);
               // do something useful
          }
     });
};

const sendWelcomeEmail = (email, name, type) => {
     const endDate = new Date();
     endDate.setDate(endDate.getDate() + 14);
     const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
     const formattedDate = (dt) => dt.toLocaleDateString("en-US", options);

     const transporter = nodemailer.createTransport({
          host: "smtp.office365.com",
          port: 587,
          secure: false,
          auth: {
               user: process.env.EMAIL,
               pass: process.env.PASSWORD,
          },
     });

     let subject, introMessage;

     if (type === "ecommerce") {
          subject = "Welcome to Our IMarketplace";
          introMessage = `
      <p>We are thrilled to welcome you as a new vendor on our vibrant and dynamic ecommerce marketplace.</p>
      <p>We understand that getting started in a new marketplace can be both thrilling and challenging, and we want to support you every step of the way.</p>
      <p>Here are some key benefits of joining our platform:</p>
      <ul>
        <li>Opportunity to create and customize your ecommerce store.</li>
        <li>Full access to our suite of tools and features.</li>
        <li>Upload and organize your products, descriptions, and images.</li>
        <li>Familiarize yourself with our user-friendly interface.</li>
        <li>Explore our robust marketing, promotional, and video training resources.</li>
        <li>Evaluate the effectiveness of our platform for your business.</li>
      </ul>
    `;
     } else if (type === "service") {
          subject = "Welcome to Our ImarketPlace Service Platform";
          introMessage = `
      <p>We are excited to welcome you to our service platform, where talented individuals like yourself connect and collaborate on various projects.</p>
      <p>As a member, you'll enjoy:</p>
      <ul>
        <li>Access to a diverse range of projects.</li>
        <li>The flexibility to set your own schedule and rates.</li>
        <li>A platform to showcase your skills and build your professional portfolio.</li>
        <li>Secure and reliable payment processing for your completed projects.</li>
        <li>A supportive community of freelancers and clients.</li>
      </ul>
    `;
     }

     const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: subject,
          html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          /* CSS styles for the email template */
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

          body {
            font-family: 'Montserrat', Arial, sans-serif;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
            border-radius: 5px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .message {
            margin-bottom: 20px;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
          }
          .highlight {
            font-weight: bold;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
          }
          .logo {
            display: block;
            margin: 0 auto;
            max-width: 200px;
          }
          .cta-button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
          }
          .cta-button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img class="logo" src="https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/logo.png" alt="Company Logo">
            <h1 style="color: #333333;">Welcome as a New ${
                 type === "ecommerce" ? "Vendor" : "Member"
            }!</h1>
          </div>
          <div class="message">
            <p>Dear ${name},</p>
            ${introMessage}
          </div>
          <div class="message">
            <p>Welcome aboard! If you have any questions or need further assistance, please do not hesitate to reach out to us. We are always here to help.</p>
            <a class="cta-button" href="https://example.com">Get Started</a>
          </div>
          <div class="footer">
            <p style="color: #777777;">This email was sent by Breaking Black Ventures, LLC. If you no longer wish to receive emails from us, please <a href="#" style="color: #777777; text-decoration: underline;">unsubscribe</a>.</p>
          </div>
        </div>
      </body>
      </html>       
    `,
     };

     transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
               console.log(error);
          } else {
               console.log("Email sent: " + info.response);
               // do something useful
          }
     });
};

const sendAdminResetPasswordMail = (email, name, adminId, token, url) => {
     const transporter = nodemailer.createTransport({
          host: "smtp.office365.com",
          port: 587,
          secure: false,
          auth: {
               user: process.env.EMAIL,
               pass: process.env.PASSWORD,
          },
     });
     let subject, introMessage;
     let resetLink = `${url}/change-password/${adminId}?token=${token}`;

     subject = `Welcome ${name} to ImarketPlace Admin Service - The Guardians of Our Digital Realm!`;
     introMessage = `
<a href="${resetLink}"><p>Click here to reset your password </p></a>
`;

     const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: subject,
          html: `
<!DOCTYPE html>
<html>
<head>
<style>
/* CSS styles for the email template */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

body {
font-family: 'Montserrat', Arial, sans-serif;
line-height: 1.6;
}
.container {
max-width: 600px;
margin: 0 auto;
padding: 20px;
background-color: #f5f5f5;
border-radius: 5px;
}
.header {
text-align: center;
margin-bottom: 20px;
}
.message {
margin-bottom: 20px;
background-color: #ffffff;
padding: 20px;
border-radius: 5px;
}
.highlight {
font-weight: bold;
}
.footer {
margin-top: 20px;
text-align: center;
font-size: 12px;
}
.logo {
display: block;
margin: 0 auto;
max-width: 200px;
}
.cta-button {
display: inline-block;
margin-top: 20px;
padding: 10px 20px;
background-color: #007bff;
color: #ffffff;
text-decoration: none;
border-radius: 5px;
}
.cta-button:hover {
background-color: #0056b3;
}
</style>
</head>
<body>
<div class="container">
<div class="header">
<img class="logo" src="https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/logo.png" alt="Company Logo">
</div>
<div class="message">
<p>Dear ${name},</p>
${introMessage}
</div>
<div class="message">
<p>Welcome aboard! If you have any questions or need further assistance, please do not hesitate to reach out to us. We are always here to help.</p>
<a class="cta-button" href="${resetLink}"> Get Started</a>
</div>
<div class="footer">
<p style="color: #777777;">This email was sent by Breaking Black Ventures, LLC. If you no longer wish to receive emails from us, please <a href="#" style="color: #777777; text-decoration: underline;">unsubscribe</a>.</p>
</div>
</div>
</body>
</html>       
`,
     };

     transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
               console.log(error);
          } else {
               console.log("Admin Welcome Email sent: " + info.response);
               // do something useful
          }
     });
};

const sendAdminWelcomeMail = (email, name, adminId, token, url) => {
     const transporter = nodemailer.createTransport({
          host: "smtp.office365.com",
          port: 587,
          secure: false,
          auth: {
               user: process.env.EMAIL,
               pass: process.env.PASSWORD,
          },
     });
     let subject, introMessage;
     let resetLink = `${url}/change-password/${adminId}?token=${token}`;

     subject = `Welcome ${name} to ImarketPlace Admin Service - The Guardians of Our Digital Realm!`;
     introMessage = `
<p>We are thrilled to welcome you as a new admin member on our vibrant and dynamic ecommerce marketplace.</p>
<a href="${resetLink}"><p>Click here to set up your password </p></a>
`;

     const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: subject,
          html: `
<!DOCTYPE html>
<html>
<head>
<style>
  /* CSS styles for the email template */
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

  body {
    font-family: 'Montserrat', Arial, sans-serif;
    line-height: 1.6;
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 5px;
  }
  .header {
    text-align: center;
    margin-bottom: 20px;
  }
  .message {
    margin-bottom: 20px;
    background-color: #ffffff;
    padding: 20px;
    border-radius: 5px;
  }
  .highlight {
    font-weight: bold;
  }
  .footer {
    margin-top: 20px;
    text-align: center;
    font-size: 12px;
  }
  .logo {
    display: block;
    margin: 0 auto;
    max-width: 200px;
  }
  .cta-button {
    display: inline-block;
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #007bff;
    color: #ffffff;
    text-decoration: none;
    border-radius: 5px;
  }
  .cta-button:hover {
    background-color: #0056b3;
  }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <img class="logo" src="https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/logo.png" alt="Company Logo">
  </div>
  <div class="message">
    <p>Dear ${name},</p>
    ${introMessage}
  </div>
  <div class="message">
    <p>Welcome aboard! If you have any questions or need further assistance, please do not hesitate to reach out to us. We are always here to help.</p>
  </div>
  <div class="footer">
    <p style="color: #777777;">This email was sent by Breaking Black Ventures, LLC. If you no longer wish to receive emails from us, please <a href="#" style="color: #777777; text-decoration: underline;">unsubscribe</a>.</p>
  </div>
</div>
</body>
</html>       
`,
     };

     transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
               console.log(error);
          } else {
               console.log("Admin Welcome Email sent: " + info.response);
               // do something useful
          }
     });
};

const sendTrialEndReminderEmail = (email, name, company_id, type) => {
     const endDate = new Date();
     endDate.setDate(endDate.getDate() + 14);
     const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
     const formattedDate = (dt) => dt.toLocaleDateString("en-US", options);
     const extensionLink = `https://market-server.azurewebsites.net/api/trial?company_id=${company_id}`;

     const transporter = nodemailer.createTransport({
          host: "smtp.office365.com",
          port: 587,
          secure: false,
          auth: {
               user: process.env.EMAIL,
               pass: process.env.PASSWORD,
          },
     });

     const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: subject,
          html: `
       <!DOCTYPE html>
       <html>
       <head>
         <style>
           /* CSS styles for the email template */
           @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
       
           body {
             font-family: 'Montserrat', Arial, sans-serif;
             line-height: 1.6;
           }
           .container {
             max-width: 600px;
             margin: 0 auto;
             padding: 20px;
             background-color: #f5f5f5;
             border-radius: 5px;
           }
           .header {
             text-align: center;
             margin-bottom: 20px;
           }
           .message {
             margin-bottom: 20px;
             background-color: #ffffff;
             padding: 20px;
             border-radius: 5px;
           }
           .highlight {
             font-weight: bold;
           }
           .footer {
             margin-top: 20px;
             text-align: center;
             font-size: 12px;
           }
           .logo {
             display: block;
             margin: 0 auto;
             max-width: 200px;
           }
           .cta-button {
             display: inline-block;
             margin-top: 20px;
             padding: 10px 20px;
             background-color: #007bff;
             color: #ffffff;
             text-decoration: none;
             border-radius: 5px;
           }
           .cta-button:hover {
             background-color: #0056b3;
           }
         </style>
       </head>
       <body>
         <div class="container">
           <div class="header">
             <img class="logo" src="https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/logo.png" alt="Company Logo">
             <h1 style="color: #333333;">Trial End Reminder</h1>
           </div>
           <div class="message">
             <p>Dear ${name},</p>
             ${introMessage}
             <p>Your trial period will expire on ${formattedDate(endDate)}.</p>
             <p>Please feel free to continue exploring and utilizing our ${trialType} during this trial period.</p>
             <p>If you have any questions or need any assistance, our support team is ready to help.</p>
             <p>Thank you for trying out our platform. We hope you've had a positive experience so far and consider continuing with our service.</p>
             <p>If you need more time to explore our platform, we are happy to offer you a one-week extension for your trial period. To extend your trial, simply click the button below:</p>
             <a href="${extensionLink}" class="cta-button">Extend Trial</a>
           </div>
           <div class="footer">
             <p style="color: #777777;">This email was sent by Breaking Black Ventures, LLC. If you have any questions, please <a href="mailto:info@example.com" style="color: #777777; text-decoration: underline;">contact us</a>.</p>
           </div>
         </div>
       </body>
       </html>                   
    `,
     };
     transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
               console.log(error);
          } else {
               console.log("Email sent: " + info.response);
               // do something useful
          }
     });
};

const sendTrialExtensionEmail = (email, name, trialEndDate, type) => {
     const endDate = new Date();
     endDate.setDate(endDate.getDate() + 14);
     const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
     const formattedDate = (dt) => dt.toLocaleDateString("en-US", options);

     const transporter = nodemailer.createTransport({
          host: "smtp.office365.com",
          port: 587,
          secure: false,
          auth: {
               user: process.env.EMAIL,
               pass: process.env.PASSWORD,
          },
     });

     let subject, introMessage, benefitsMessage;

     if (type === "ecommerce") {
          subject = "Your Free Trial Period Has Been Extended!";
          introMessage = `
            <p>We hope you're enjoying your trial period on our vibrant and dynamic ecommerce marketplace.</p>
            <p>We're excited to inform you that your trial period has been extended by 7 days. You now have additional time to explore our platform, showcase your products, and familiarize yourself with all the features and tools we offer.</p>
            <p>Please note the updated trial end date:</p>
            <ul>
              <li><span class="highlight">Trial End Date:</span> ${formattedDate(trialEndDate)}</li>
            </ul>
       `;
          benefitsMessage = `
            <p><span class="highlight">Benefits of the Extended Trial Period:</span></p>
            <ul>
              <li>Opportunity to create and customize your ecommerce store.</li>
              <li>Full access to our suite of tools and features.</li>
              <li>Upload and organize your products, descriptions, and images.</li>
              <li>Familiarize yourself with our user-friendly interface.</li>
              <li>Explore our robust marketing, promotional, and video training resources.</li>
              <li>Evaluate the effectiveness of our platform for your business.</li>
            </ul>
       `;
     } else if (type === "service") {
          subject = "Your Free Trial Period Has Been Extended!";
          introMessage = `
            <p>We hope you're enjoying your trial period with iMarketplace Service, your partner in success and empowerment.</p>
            <p>We're excited to inform you that your trial period has been extended by 7 days. You now have additional time to explore the benefits of our service, connect with our team, and make the most of the resources available to you.</p>
            <p>Please note the updated trial end date:</p>
            <ul>
              <li><span class="highlight">Trial End Date:</span> ${formattedDate(trialEndDate)}</li>
            </ul>
       `;
          benefitsMessage = `
            <p><span class="highlight">Benefits of the Extended Trial Period with iMarketplace Service:</span></p>
            <ul>
              <li>Access to a team of experienced and dedicated professionals.</li>
              <li>Personalized service sessions tailored to your goals.</li>
              <li>Guidance in areas such as business strategy, marketing, and growth.</li>
              <li>Exclusive access to workshops, webinars, and networking events.</li>
              <li>Opportunity to connect with a community of like-minded individuals and businesses.</li>
              <li>Regular updates on industry trends and business insights.</li>
            </ul>
       `;
     }

     const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: subject,
          html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          /* CSS styles for the email template */
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
  
          body {
            font-family: 'Montserrat', Arial, sans-serif;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
            border-radius: 5px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .message {
            margin-bottom: 20px;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
          }
          .highlight {
            font-weight: bold;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
          }
          .logo {
            display: block;
            margin: 0 auto;
            max-width: 200px;
          }
          .cta-button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
          }
          .cta-button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img class="logo" src="https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/logo.png" alt="Company Logo">
            <h1 style="color: #333333;">Your Free Trial Period Has Been Extended!</h1>
          </div>
          <div class="message">
            <p>Dear ${name},</p>
            ${introMessage}
          </div>
          <hr style="border: none; border-top: 1px solid #dddddd; margin: 20px 0;">
          <div class="message">
            ${benefitsMessage}
          </div>
          <hr style="border: none; border-top: 1px solid #dddddd; margin: 20px 0;">
          <div class="message">
            <p>We realize that we, as people of color, are stronger together, and when we stand together, our possibilities are limitless.</p>
          </div>
          <div class="message">
            <p>Keep making the most of your extended trial period! If you have any questions or need further assistance, please don't hesitate to reach out to us. We're here to support you.</p>
            <a class="cta-button" href="https://example.com">Get Started</a>
          </div>
          <div class="footer">
            <p style="color: #777777;">This email was sent by Breaking Black Ventures, LLC. If you no longer wish to receive emails from us, please <a href="#" style="color: #777777; text-decoration: underline;">unsubscribe</a>.</p>
          </div>
        </div>
      </body>
      </html>        
 `,
     };
     transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
               console.log(error);
          } else {
               console.log("Email sent: " + info.response);
               // do something useful
          }
     });
};

const sendSubscriptionEmail = (email, name) => {
     const transporter = nodemailer.createTransport({
          host: "smtp.office365.com",
          port: 587,
          secure: false,
          auth: {
               user: process.env.EMAIL,
               pass: process.env.PASSWORD,
          },
     });
     const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Thank You for Subscribing to Our Service",
          html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        /* CSS styles for the email template */
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
    
        body {
          font-family: 'Montserrat', Arial, sans-serif;
          line-height: 1.6;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
          border-radius: 5px;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .message {
          margin-bottom: 20px;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 5px;
        }
        .highlight {
          font-weight: bold;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
        }
        .logo {
          display: block;
          margin: 0 auto;
          max-width: 200px;
        }
        .cta-button {
          display: inline-block;
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #007bff;
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
        }
        .cta-button:hover {
          background-color: #0056b3;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img class="logo" src="https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/logo.png" alt="Company Logo">
          <h1 style="color: #333333;">Thank You for Subscribing to Our Service!</h1>
        </div>
        <div class="message">
          <p>Dear ${name},</p>
          <p>Thank you for subscribing to our service! We're thrilled to have you on board.</p>
          <p>By subscribing, you'll gain access to a range of benefits and features that will enhance your experience with our service. We're committed to providing you with top-notch support and ensuring your satisfaction.</p>
          <p>If you have any questions, feedback, or need assistance, please feel free to reach out to us. Our dedicated support team is ready to assist you.</p>
        </div>
        <div class="message">
          <p>Here's what you can expect as a subscriber:</p>
          <ul>
            <li>Access to exclusive features and functionality.</li>
            <li>Regular updates and improvements to enhance your experience.</li>
            <li>Priority customer support for any service-related inquiries.</li>
            <li>Opportunity to provide feedback and influence future enhancements.</li>
          </ul>
        </div>
        <div class="footer">
          <p style="color: #777777;">This email was sent by Breaking Black Ventures, LLC. If you have any concerns or wish to unsubscribe from our service, please <a href="#" style="color: #777777; text-decoration: underline;">contact us</a>.</p>
        </div>
      </div>
    </body>
    </html>       
 `,
     };
     transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
               console.log(error);
          } else {
               console.log("Email sent: " + info.response);
               // do something useful
          }
     });
};

const sendSubscriptionExpiredEmail = (email, name) => {
     const transporter = nodemailer.createTransport({
          host: "smtp.office365.com",
          port: 587,
          secure: false,
          auth: {
               user: process.env.EMAIL,
               pass: process.env.PASSWORD,
          },
     });
     const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Subscription Expired or Canceled",
          html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        /* CSS styles for the email template */
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
    
        body {
          font-family: 'Montserrat', Arial, sans-serif;
          line-height: 1.6;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
          border-radius: 5px;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .message {
          margin-bottom: 20px;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 5px;
        }
        .highlight {
          font-weight: bold;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
        }
        .logo {
          display: block;
          margin: 0 auto;
          max-width: 200px;
        }
        .cta-button {
          display: inline-block;
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #007bff;
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
        }
        .cta-button:hover {
          background-color: #0056b3;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img class="logo" src="https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/logo.png" alt="Company Logo">
          <h1 style="color: #333333;">Your Subscription Has Expired or Been Canceled</h1>
        </div>
        <div class="message">
          <p>Dear ${name},</p>
          <p>We're writing to inform you that your subscription has expired or been canceled.</p>
          <p>We want to take this opportunity to thank you for being a valued subscriber and for your support during the subscription period. We hope our service has met your expectations and provided you with value.</p>
          <p>If you have any questions, need assistance, or would like to reactivate your subscription, please feel free to contact our support team. We'll be happy to assist you.</p>
        </div>
        <div class="message">
          <p>We appreciate your time with us and hope to have the opportunity to serve you again in the future.</p>
          <p>Thank you and best regards,</p>
          <p>The IsraelB Marketplace Team</p>
        </div>
        <div class="footer">
          <p style="color: #777777;">This email was sent by Breaking Black Ventures, LLC. If you have any concerns, please <a href="#" style="color: #777777; text-decoration="underline;">contact us</a>.</p>
        </div>
      </div>
    </body>
    </html>       
 `,
     };
     transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
               console.log(error);
          } else {
               console.log("Email sent: " + info.response);
               // do something useful
          }
     });
};

const sendCouponEmail = (email, name) => {
     const transporter = nodemailer.createTransport({
          host: "smtp.office365.com",
          port: 587,
          secure: false,
          auth: {
               user: process.env.EMAIL,
               pass: process.env.PASSWORD,
          },
     });

     const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "FREE Ads Code: Supercharge Your Sales Today!",
          html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          /* CSS styles for the email template */
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

          body {
            font-family: 'Montserrat', Arial, sans-serif;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
            border-radius: 5px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .message {
            margin-bottom: 20px;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
          }
          .highlight {
            font-weight: bold;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
          }
          .logo {
            display: block;
            margin: 0 auto;
            max-width: 200px;
          }
          .cta-button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
          }
          .cta-button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img class="logo" src="https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/logo.png" alt="Company Logo">
            <h1 style="color: #333333;">Welcome as a New ${
                 type === "ecommerce" ? "Vendor" : "Member"
            }!</h1>
          </div>
          <div class="message">
            <p>Dear ${name},</p>
            <p>We have fantastic news for you as a valued tenant on our ecommerce marketplace! You now have access to a FREE Ads code that will turbocharge your sales and attract more customers to your store's landing page.</p>
            <p>With our Ads code, you can:</p>
            <ul>
              <li>Boost Visibility: Display your products prominently on our high-traffic landing page, reaching a wider audience of potential customers.</li>
              <li>Drive Targeted Traffic: Attract visitors who are genuinely interested in your products, resulting in higher conversion rates and increased sales.</li>
              <li>Amplify Your Brand: Create an immersive brand experience, highlight special offers, and leave a lasting impression on your customers.</li>
            </ul>
          </div>
          <div class="message">
            <p>It's easy to get started:</p>
            <ol>
              <li>Log in to your store's admin panel on our marketplace.</li>
              <li>Go to the "Ads" section in your dashboard.</li>
              <li>Follow the instructions to generate your unique Ads code.</li>
              <li>Copy and paste the code onto your store's landing page.</li>
            </ol>
            <p>Watch your sales grow as the Ads code works its magic!</p>
            <p>If you need any assistance, our dedicated support team is here to help. Contact us at [support email/phone number].</p>
            <p>Don't miss out on this incredible opportunity to boost your online presence and generate more revenue. The FREE Ads code is our way of showing appreciation for your commitment to our marketplace.</p>
          </div>
          <div class="footer">
            <p style="color: #777777;">This email was sent by Breaking Black Ventures, LLC. If you no longer wish to receive emails from us, please <a href="#" style="color: #777777; text-decoration: underline;">unsubscribe</a>.</p>
          </div>
        </div>
      </body>
      </html>
    `,
     };

     transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
               console.log(error);
          } else {
               console.log("Email sent: " + info.response);
               // do something useful
          }
     });
};

const sendForgotPasswordEmail = (email, name, token, url) => {
     const transporter = nodemailer.createTransport({
          host: "smtp.office365.com",
          port: 587,
          secure: false,
          auth: {
               user: process.env.EMAIL,
               pass: process.env.PASSWORD,
          },
     });

     const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Reset Password",
          html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          /* CSS styles for the email template */
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

          body {
            font-family: 'Montserrat', Arial, sans-serif;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
            border-radius: 5px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .message {
            margin-bottom: 20px;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
          }
          .highlight {
            font-weight: bold;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
          }
          .logo {
            display: block;
            margin: 0 auto;
            max-width: 200px;
          }
          .cta-button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
          }
          .cta-button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img class="logo" src="https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/logo.png" alt="Company Logo">
            <h1 style="color: #333333;">Reset Password Request</h1>
          </div>
          <div class="message">
            <p>Dear ${name},</p>
            <p>You requested to reset the password to your account.</p>
            <p>Click on the button below to reset your password</p>
          </div>
          <div class="message">
            <a class="cta-button" href="${url}/reset-password/${token}">Reset Password</a>
            <p>Ignore this email if this was not requested by you.</p>
            <p>If you need any assistance, our dedicated support team is here to help. Contact us at [support email/phone number].</p>
          </div>
          <div class="footer">
            <p style="color: #777777;">This email was sent by Breaking Black Ventures, LLC. If you no longer wish to receive emails from us, please <a href="#" style="color: #777777; text-decoration: underline;">unsubscribe</a>.</p>
          </div>
        </div>
      </body>
      </html>
    `,
     };

     transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
               console.log(error);
          } else {
               console.log("Email sent: " + info.response);
               // do something useful
          }
     });
};

const sendSubscriptionCancelEmail = (email, name, token) => {
     const transporter = nodemailer.createTransport({
          host: "smtp.office365.com",
          port: 587,
          secure: false,
          auth: {
               user: process.env.EMAIL,
               pass: process.env.PASSWORD,
          },
     });

     const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Your Subscription - Let's Talk",
          html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          /* CSS styles for the email template */
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

          body {
            font-family: 'Montserrat', Arial, sans-serif;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
            border-radius: 5px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .message {
            margin-bottom: 20px;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px.
          }
          .highlight {
            font-weight: bold;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
          }
          .logo {
            display: block;
            margin: 0 auto;
            max-width: 200px;
          }
          .cta-button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
          }
          .cta-button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class "header">
            <img class="logo" src="https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/logo.png" alt="Company Logo">
            <h1 style="color: #333333;">Your Subscription - Let's Talk</h1>
          </div>
          <div class="message">
            <p>Dear ${name},</p>
            <p>I hope this email finds you well. We value your support as a member of iShop.black, and your satisfaction is our priority. I noticed your recent subscription cancellation request, and I'd like to understand your concerns. Could you share your reasons for canceling? Your feedback is crucial for us to improve.</p>
            <p>If you're open to it, we can schedule a brief call with our customer support team to address your concerns and explore solutions together.</p>
            <p>Your satisfaction is important to us, and we appreciate your continued support.</p>
            <a href="https://dashboard.ishop.black/billing?cancel=true&token=${token}">proceed to cancellation</a>
          </div>
          <hr style="border: none; border-top: 1px solid #dddddd; margin: 20px 0;">
          <div class="message">
            <p>Best regards,</p>
            <p>Isaiah Ben Israel</p>
            <p>C.E.O</p>
            <p>Breaking Black Ventures</p>
          </div>
          <div class="footer">
            <p style="color: #777777;">This email was sent by Breaking Black Ventures, LLC. If you no longer wish to receive emails from us, please <a href="#" style="color: #777777; text-decoration: underline;">unsubscribe</a>.</p>
          </div>
        </div>
      </body>
      </html>
    `,
     };

     transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
               console.log(error);
          } else {
               console.log("Email sent: " + info.response);
               // do something useful
          }
     });
};

const sendAdminMessage = (email, name, message) => {
     const transporter = nodemailer.createTransport({
          host: "smtp.office365.com",
          port: 587,
          secure: false,
          auth: {
               user: process.env.EMAIL,
               pass: process.env.PASSWORD,
          },
     });

     const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Important: New Message From Admin",
          html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          /* CSS styles for the email template */
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

          body {
            font-family: 'Montserrat', Arial, sans-serif;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
            border-radius: 5px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .message {
            margin-bottom: 20px;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px.
          }
          .highlight {
            font-weight: bold;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
          }
          .logo {
            display: block;
            margin: 0 auto;
            max-width: 200px;
          }
          .cta-button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
          }
          .cta-button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class "header">
            <img class="logo" src="https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/logo.png" alt="Company Logo">
            <h1 style="color: #333333;">New Message From Admin</h1>
          </div>
          <div class="message">
            <p>Dear ${name},</p>
            <p>${message}</p>
            </div>
          <div class="footer">
            <p style="color: #777777;">This email was sent by Breaking Black Ventures, LLC. If you no longer wish to receive emails from us, please <a href="#" style="color: #777777; text-decoration: underline;">unsubscribe</a>.</p>
          </div>
        </div>
      </body>
      </html>
    `,
     };

     transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
               console.log(error);
          } else {
               console.log("Email sent: " + info.response);
               // do something useful
          }
     });
};

const sendVendorMessage = (email, name, message, orderID) => {
     const transporter = nodemailer.createTransport({
          host: "smtp.office365.com",
          port: 587,
          secure: false,
          auth: {
               user: process.env.EMAIL,
               pass: process.env.PASSWORD,
          },
     });

     const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: `Important: New Message Regarding Your Order: ${orderID}`,
          html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          /* CSS styles for the email template */
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

          body {
            font-family: 'Montserrat', Arial, sans-serif;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
            border-radius: 5px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .message {
            margin-bottom: 20px;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px.
          }
          .highlight {
            font-weight: bold;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
          }
          .logo {
            display: block;
            margin: 0 auto;
            max-width: 200px;
          }
          .cta-button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
          }
          .cta-button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class "header">
            <img class="logo" src="https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/logo.png" alt="Company Logo">
            <h1 style="color: #333333;">New Message Regarding Your Order: ${orderID}</h1>
          </div>
          <div class="message">
            <p>Dear ${name},</p>
            <p>${message}</p>
            </div>
          <div class="footer">
            <p style="color: #777777;">This email was sent by Breaking Black Ventures, LLC. If you no longer wish to receive emails from us, please <a href="#" style="color: #777777; text-decoration: underline;">unsubscribe</a>.</p>
          </div>
        </div>
      </body>
      </html>
    `,
     };

     transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
               console.log(error);
          } else {
               console.log("Email sent: " + info.response);
               // do something useful
          }
     });
};

const sendCreateEventMail = (email, token) => {
     const transporter = nodemailer.createTransport({
          host: "smtp.office365.com",
          port: 587,
          secure: false,
          auth: {
               user: process.env.EMAIL,
               pass: process.env.PASSWORD,
          },
     });

     const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: `Finish Creating Your Event`,
          html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          /* CSS styles for the email template */
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

          body {
            font-family: 'Montserrat', Arial, sans-serif;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
            border-radius: 5px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .message {
            margin-bottom: 20px;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px.
          }
          .highlight {
            font-weight: bold;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
          }
          .logo {
            display: block;
            margin: 0 auto;
            max-width: 200px;
          }
          .cta-button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
          }
          .cta-button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class "header">
            <img class="logo" src="https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/logo.png" alt="Company Logo">
            <h1 style="color: #333333;">Finish Creating Your Event</h1>
          </div>
          <div class="message">
            <p>Follow this link to confirm your email and finish creating your event</p>
            <a class="cta-button" href="https://ishop.black/event/new-event?token=${token}">Finish</a>
            </div>
          <div class="footer">
            <p style="color: #777777;">This email was sent by Breaking Black Ventures, LLC. If you no longer wish to receive emails from us, please <a href="#" style="color: #777777; text-decoration: underline;">unsubscribe</a>.</p>
          </div>
        </div>
      </body>
      </html>
    `,
     };

     transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
               console.log(error);
          } else {
               console.log("Email sent: " + info.response);
               // do something useful
          }
     });
};

const sendVideoInvite = (email, url, name) => {
     const transporter = nodemailer.createTransport({
          host: "smtp.office365.com",
          port: 587,
          secure: false,
          auth: {
               user: process.env.EMAIL,
               pass: process.env.PASSWORD,
          },
     });

     const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: `Video Meeting Invitation`,
          html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          /* CSS styles for the email template */
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

          body {
            font-family: 'Montserrat', Arial, sans-serif;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
            border-radius: 5px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .message {
            margin-bottom: 20px;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px.
          }
          .highlight {
            font-weight: bold;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
          }
          .logo {
            display: block;
            margin: 0 auto;
            max-width: 200px;
          }
          .cta-button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
          }
          .cta-button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class "header">
            <img class="logo" src="https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/logo.png" alt="Company Logo">
            <h1 style="color: #333333;">Video Meeting Invitation</h1>
          </div>
          <div class="message">
            <p>Hi ${name}, Click on the button below to join the meeting</p>
            <a class="cta-button" href="${url}">Join meeting</a>
            </div>
          <div class="footer">
            <p style="color: #777777;">This email was sent by Breaking Black Ventures, LLC. If you no longer wish to receive emails from us, please <a href="#" style="color: #777777; text-decoration: underline;">unsubscribe</a>.</p>
          </div>
        </div>
      </body>
      </html>
    `,
     };

     transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
               console.log(error);
          } else {
               console.log("Email sent: " + info.response);
               // do something useful
          }
     });
};

const sendRatingMail = (email, name, url, product) => {
     const transporter = nodemailer.createTransport({
          host: "smtp.office365.com",
          port: 587,
          secure: false,
          auth: {
               user: process.env.EMAIL,
               pass: process.env.PASSWORD,
          },
     });

     const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: `Your Order ${product._id} - Please rate the products you purchased!`,
          html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          /* CSS styles for the email template */
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

          body {
            font-family: 'Montserrat', Arial, sans-serif;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
            border-radius: 5px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .message {
            margin-bottom: 20px;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
          }
          .highlight {
            font-weight: bold;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            padding: 10px;
          }
          .logo {
            display: block;
            margin: 0 auto;
            max-width: 200px;
          }
          .cta-button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
          }
          .cta-button:hover {
            background-color: #0056b3;
          }
          .reviewBtn {
            font-weight: bold;
            color: white;
            border-radius: 8px;
            padding: 10px 20px;
            background-color: white;
            border: 1px solid blue;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img class="logo" src="https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/logo.png" alt="Company Logo">
          </div>
          <div class="message">
            <p>Dear ${name},</p>
            <p>Thank you for your purchase on ${url}.</p>
            <p>Please help us improve our service and give all ${url} customers a better understanding about the product(s) you ordered by rating them from very poor to very good</p>
          </div>
          <div class="message">
            <div>
            <img class="logo" src="${product.image_1920}" alt="product">
            <div>
              <p>${product.name}</p>
              <a class="cta-button" href="https://${url}/dashboard/pending-review/${product._id}">Rate this product</a>
            </div>
            </div>
            <p>If the link to rate the product is not working, no worries. You can still share your feedback by following these steps:</p>
            <span>On your computer:</span>
            <ul>
              <li>Log in to your ${url} account.</li>
              <li>From your dashboard go to the "Pending Reviews" section.</li>
              <li>Click on Rate this product button</li>
            </ul>
          </div>
          <div class="footer">
          <p>
          If you're not happy with your purchase, you can return it to us with ease. ${url} offers a simple return and quick refund process. Click here to <a href="https://${url}/faq">learn more</a>.  
            </p>
            <p>
            You can return an item within 7 days of delivery if it is not as expected (wrong, defective, or damaged). In most cases, you can also return an item if you change your mind. To request a return, go to the <a href="https://${url}/dashboard/order">Order page</a>.
            </p>
            <p style="color: #777777;">This email was sent by Breaking Black Ventures, LLC. If you no longer wish to receive emails from us, please <a href="#" style="color: #777777; text-decoration: underline;">unsubscribe</a>.</p>
          </div>
        </div>
      </body>
      </html>
    `,
     };

     transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
               console.log(error);
          } else {
               console.log("Email sent: " + info.response);
               // do something useful
          }
     });
};

const sendAdvertisementNotificationEmail = (
     email,
     userName,
     advertisementDetails,
     advertisementLink,
) => {
     const transporter = nodemailer.createTransport({
          host: "smtp.office365.com",
          port: 587,
          secure: false,
          auth: {
               user: process.env.EMAIL,
               pass: process.env.PASSWORD,
          },
     });

     const subject = `New Advertisement Alert - Explore Now!`;
     const introMessage = `
  <p>Dear ${userName},</p>
  <p>We're thrilled to inform you about a new advertisement from one of our vendors. Don't miss out on the latest offers!</p>
  <p><strong>Advertisement Details:</strong></p>
  <ul>
       <li><strong>Product/Service:</strong> ${advertisementDetails.productService}</li>
       <li><strong>Description:</strong> ${advertisementDetails.description}</li>
  </ul>
  <p>Click the button below to explore the advertisement:</p>
  <a class="cta-button" href="${advertisementLink}">Explore Now</a>
  `;

     const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: subject,
          html: `
       <!DOCTYPE html>
       <html>
       <head>
            <style>
                 /* CSS styles for the email template */
                 @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
                 <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

                 body {
                      font-family: 'Montserrat', Arial, sans-serif;
                      line-height: 1.6;
                 }
                 .container {
                      max-width: 600px;
                      margin: 0 auto;
                      padding: 20px;
                      background-color: #f5f5f5;
                      border-radius: 5px;
                 }
                 .header {
                      text-align: center;
                      margin-bottom: 20px;
                 }
                 .message {
                      margin-bottom: 20px;
                      background-color: #ffffff;
                      padding: 20px;
                      border-radius: 5px;
                 }
                 .highlight {
                      font-weight: bold;
                 }
                 .footer {
                      margin-top: 20px;
                      text-align: center;
                      font-size: 12px;
                 }
                 .logo {
                      display: block;
                      margin: 0 auto;
                      max-width: 200px;
                 }
                 .cta-button {
                      display: inline-block;
                      margin-top: 20px;
                      padding: 10px 20px;
                      background-color: #007bff;
                      color: #ffffff;
                      text-decoration: none;
                      border-radius: 5px;
                 }
                 .cta-button:hover {
                      background-color: #0056b3;
                 }
            </style>
       </head>
       <body>
            <div class="container">
                 <div class="header">
                      <img class="logo" src="https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/logo.png" alt="Company Logo">
                 </div>
                 <div class="message">
                      ${introMessage}
                 </div>
                 <div class="footer">
                      <p style="color: #777777;">This email was sent by [Your Company Name]. If you no longer wish to receive emails from us, please <a href="#" style="color: #777777; text-decoration: underline;">unsubscribe</a>.</p>
                 </div>
            </div>
       </body>
       </html>       
       `,
     };

     transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
               console.log(error);
          } else {
               console.log("Advertisement Notification Email sent: " + info.response);
          }
     });
};

const createOrderTable = (order) => {
     let table = `
          <h3>Order # ${order.orderId}</h3>
          
          <table border="1" class='table'>
            <tr>
              <th>SN</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>`;

     order.items.map((item, index) => {
          table += `
            <tr>
              <td>${index + 1}</td>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>$${item.price.toFixed(2)}</td>
            </tr>`;
     });

     table += "</table>";
     return table;
};

const createOrderReport = (orders) => {
     let totalRevenue = 0;
     let numberOfOrders = 0;
     let numberOfItems = 0;

     if (Array.isArray(orders)) {
          numberOfOrders = orders.length;
          orders.forEach((order) => {
               order.items.forEach((item) => {
                    numberOfItems += item.quantity;
                    totalRevenue += item.quantity * item.price;
               });
          });
     } else {
          numberOfOrders = 1;
          orders.items.forEach((item) => {
               numberOfItems += item.quantity;
          });
          totalRevenue = orders.items.reduce((total, item) => {
               const subtotal = item.quantity * item.price;
               return total + subtotal;
          }, 0);
     }
     let report = `
      <div class='box-container'>
        <div className="box">
          <div class="box-content">
            <div style="display: flex; justify-content: flex-end;">                
                <div className="text-end">                     
                     <p class="box-number">                          
                             ${Number(totalRevenue).toLocaleString()}                          
                     </p>
                </div>
            </div> 
            <div className="lh-1">
              <p class="box-number">Total Revenue</p>  
            </div>        
          </div>
        </div>

        <div className="box">
          <div class="box-content">
            <div style="display: flex; justify-content: flex-end;">                
                <div className="text-end">                     
                     <p class="box-number">                          
                             ${Number(numberOfItems).toLocaleString()}                          
                     </p>
                </div>
            </div> 
            <div className="lh-1">
              <p class="box-number">Total Items</p>  
            </div>        
          </div>
        </div>

        <div className="box">
          <div class="box-content">
            <div style="display: flex; justify-content: flex-end;">                
                <div className="text-end">                     
                     <p class="box-number">                          
                             ${Number(numberOfOrders).toLocaleString()}                          
                     </p>
                </div>
            </div> 
            <div className="lh-1">
              <p class="box-number">Number Of Orders</p>  
            </div>        
          </div>
        </div>
      </div>
    `;

     return report;
};

const sendPurchaseEmailPerSales = (vendorEmail, orderDetails) => {
     //  const { orderId, items } = orderDetails;
     const orderTable = createOrderTable(orderDetails);
     const report = createOrderReport(orderDetails);
     const transporter = nodemailer.createTransport({
          host: "smtp.office365.com",
          port: 587,
          secure: false,
          auth: {
               user: process.env.EMAIL,
               pass: process.env.PASSWORD,
          },
     });

     const mailOptions = {
          from: process.env.EMAIL,
          to: vendorEmail,
          subject: `New Order Email:`,
          html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          /* CSS styles for the email template */
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

          body {
            font-family: 'Montserrat', Arial, sans-serif;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
            border-radius: 5px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .message {
            margin-bottom: 20px;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px.
          }
          .highlight {
            font-weight: bold;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
          }
          .logo {
            display: block;
            margin: 0 auto;
            max-width: 200px;
          }
          .cta-button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
          }
          .cta-button:hover {
            background-color: #0056b3;
          }

          .box-container {
            display: flex;
            flex-wrap: wrap;
        }
        .box {
            flex: 0 0 calc(50% - 10px);
            max-width: calc(50% - 10px);
            margin-right: 20px;
            margin-bottom: 20px;
            border: 1px solid #B886FC;
            border-radius: 8px;
            overflow: hidden;
        }
        .box-content {
            padding: 20px;
        }
        .box-number {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
            opacity: 0.75;
            text-align: right;
        }
        .box-text {
            margin: 0;
        }
        body, table, td, th {
          margin: 0;
          padding: 0;
          border-collapse: collapse;
          border-spacing: 0;
      }
  
      /* Optional: Add some padding and border to the table */
      .table {
          width: 100%;
          border: 1px solid #ccc;
          border-radius: 4px;
      }
  
      /* Style for table headers */
      th {
          background-color: #f2f2f2;
          border-bottom: 1px solid #ccc;
          padding: 10px;
          text-align: left;
      }
  
      /* Style for table rows */
      td {
          border-bottom: 1px solid #ccc;
          padding: 10px;
      }
  
      /* Alternate row colors */
      tr:nth-child(even) {
          background-color: #f9f9f9;
      }
  
      /* Bootstrap grid classes */
      .row {
          display: flex;
          flex-wrap: wrap;
          margin-right: -15px;
          margin-left: -15px;
      }
  
      .col-lg-4 {
          flex: 0 0 33.333333%;
          max-width: 33.333333%;
          padding-right: 15px;
          padding-left: 15px;
      }
        </style>
      </head>
      <body>
        <div class="container">
          <div class "header">
            <img class="logo" src="https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/logo.png" alt="Company Logo">
            <h1 style="color: #333333;">New Message Regarding Your Order</h1>
          </div>
          <div class="message">
            <h2>Purchased Today:</h2>
        
           ${orderTable} 
           ${report}   
          </div>
          <div class="footer">
            <p style="color: #777777;">This email was sent by Breaking Black Ventures, LLC. If you no longer wish to receive emails from us, please <a href="#" style="color: #777777; text-decoration: underline;">unsubscribe</a>.</p>
          </div>
        </div>
      </body>
      </html>
    `,
     };

     transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
               console.log("Email sending error", error);
          } else {
               console.log("Email sent: " + info.response);
               // do something useful
          }
     });
};

const formatDate = (date) => {
     const year = date.getFullYear();
     const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
     const day = String(date.getDate()).padStart(2, "0");
     const formattedDate = `${year}-${month}-${day}`;
     return formattedDate;
};

const deleteUserData = async (userId, companyId, siteId) => {
     try {
          // Step 1: Find the user
          const user = await User.findById(userId);

          if (!user) {
               return { success: false, message: "User not found" };
          }

          // Step 2: Delete associated advertisements (adverts) by their _id values
          if (siteId) {
               await Advert.deleteMany({ _id: { $in: siteId } });
          }

          // Step 3: Find and delete the user's associated site if it exists
          if (siteId) {
               await Site.findByIdAndRemove(siteId);
          }

          // Step 4: Find and delete the user's associated company if it exists
          if (companyId) {
               await Company.findByIdAndRemove(companyId);
          }

          // Step 5: Delete the user account
          await User.findByIdAndRemove(userId);

          return {
               success: true,
               message: "Account, associated site, company, advertisements, and data deleted successfully",
          };
     } catch (error) {
          console.error("Error deleting account:", error);
          return { success: false, message: "Internal server error" };
     }
};

const sentReminders = new Set();

const reminderJob = () => {
     cron.schedule("0 9 * * *", () => {
          const currentDate = formatDate(new Date());

          Company.find({ trial_end_date: currentDate }, async (err, companies) => {
               if (err) {
                    console.error(err);
                    return;
               }

               for (const company of companies) {
                    const userId = company.user_id;

                    // Check if a reminder has already been sent for this user
                    if (!sentReminders.has(userId)) {
                         try {
                              const user = await User.findById(userId);
                              if (user) {
                                   sendTrialEndReminderEmail(
                                        user.email,
                                        user.firstname,
                                        company._id,
                                   );
                                   sentReminders.add(userId); // Mark the reminder as sent
                              }
                         } catch (error) {
                              console.error(error);
                         }
                    }
               }
          });
     });
};

module.exports = {
     sendOnboardingEmail,
     sendAdminWelcomeMail,
     sendAdminResetPasswordMail,
     sendTrialEndReminderEmail,
     sendTrialExtensionEmail,
     sendSubscriptionEmail,
     sendSubscriptionExpiredEmail,
     sendCouponEmail,
     sendRatingMail,
     formatDate,
     sendAdvertisementNotificationEmail,
     reminderJob,
     sendWelcomeEmail,
     sendForgotPasswordEmail,
     sendAdminMessage,
     sendVendorMessage,
     sendSubscriptionCancelEmail,
     deleteUserData,
     sendCreateEventMail,
     sendVideoInvite,
};
