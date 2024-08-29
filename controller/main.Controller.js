const fs = require("fs");
const express = require("express");
const axios = require("axios");
const { sendMail } = require("../Email/email");
const emailSchema = require("../validation/emailValidation");
const Joi = require("joi");

const router = express.Router();

router.post("/", async (req, res, next) => {
  if (!req.body) {
    return res.status(400).send({ message: "Request body is missing" });
  }

  const schemavalidate = Joi.validate(req.body, emailSchema.loginUuid);
  if (schemavalidate.error) {
    if (schemavalidate.error.details[0].type === "object.allowUnknown") {
      return res.send({
        message: "Validation Error",
      });
    }
    return res.send({
      message: schemavalidate.error.details[0].message,
    });
  }
  const payload = {
    topic: req.body.topic,
    type: req.body.type,
    start_time: req.body.start_time,
    duration: req.body.duration,
    email: req.body.email,
    agenda: req.body.agenda,
    settings: {
      host_video: true,
      participant_video: true,
      join_before_host: false,
      mute_upon_entry: true,
      watermark: false,
      use_pmi: false,
      approval_type: 0,
      audio: "both",
      auto_recording: "none",
    },
  };
  console.log("🚀 ~ router.post ~ payload.req.body.start_time:",req.body.start_time)
  const token = res.locals.accessToken;
  try {
    const bearerTokenHeader = `Bearer ${token}`;

    try {
      const response = await axios.post(
        "https://api.zoom.us/v2/users/me/meetings",
        payload,
        {
          headers: {
            Authorization: bearerTokenHeader,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("🚀 ~ router.post ~ response:", response.data);

      if (response.status === 201) {
        const mailOptions = {
          from: "vijayshagara1221@gmail.com",
          to: payload.email,
          subject: "Training Session",
          text: `Kindly click this link to join the session ${response.data.start_url}
                 Your Meeting ID - ${response.data.id}
                 Your Meeting Password - ${response.data.password}`,
        };
        if (response.data && response.data.start_url) {
          console.log("-------------------------");
          await sendMail(mailOptions);
          console.log("-------------------------");

          return res.status(200).send({
            msg: "Email send successfully",
          });
        } else {
          return res.status(400).send({
            msg: "Email not send",
          });
        }
      } else {
        console.error("Failed to create meeting:", response.data);
      }
    } catch (error) {
      console.error("Error during meeting creation:", error);
    }
  } catch (error) {
    console.error("res error========", error);
  }
});

module.exports = router;
