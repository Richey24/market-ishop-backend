const Company = require("../../model/Company");
const nodemailer = require("nodemailer");

const getCompany = async (req, res) => {
     try {
          const companyId = req.params.id;

          if (!companyId) {
               return res.status(400).json({ message: "Company ID is required" });
          }

          const company = await Company.findOne({ company_id: companyId }, "subdomain");

          if (!company) {
               return res.status(404).json({ message: "Company not found" });
          }

          res.status(200).json(company);
     } catch (error) {
          console.error(error);
          res.status(500).json({ error: error.message });
     }
};

module.exports = {
     getCompany,
};
