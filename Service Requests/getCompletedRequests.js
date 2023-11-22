import { adminAuth } from "../Admin api/adminAuth.js";
import { advisorAuth } from "../Advisor api/advisorAuth.js";
import { app, client } from "../index.js";

export function getCompletedRequests() {
    app.get("/getCompletedServiceData", async function (request, response) {
        const getData = await client
            .db("CRM")
            .collection("Service Requests")
            .find({ status: "Completed" })
            .toArray();
        if (getData) {
            response.status(200).send(getData);
        } else {
            response.status(400).send({ message: "no data" });
        }
    });
}
