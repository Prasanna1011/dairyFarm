import React, { useState, useEffect } from "react";
import {
  Form,
  Card,
  CardBody,
  Col,
  Row,
  CardTitle,
  Container,
  Button,
} from "reactstrap";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import LoaderPage from "components/Loader/LoaderPage";

import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import axios from "axios";
import {
  API_TERMS_AND_CONDITIONS_GET,
  API_TERMS_AND_CONDITIONS_UPDATE,
} from "customhooks/All_Api/Apis";
import { toast } from "react-toastify";

const TermsAndConditions = () => {
  const [termsAndConditionData, setTermsAndConditionData] = useState([]);
  const [allConditions, setAllConditions] = useState([]);
  const [ids, setIds] = useState([]);
  const [editedConditions, setEditedConditions] = useState(""); // State to hold edited content
  const { config, first_name, last_name } = GetAuthToken();
  const [loading, setLoading] = useState(true);

  // const getTermsAndConditionsData = async () => {
  //   try {
  //     const { data } = await axios.get(API_TERMS_AND_CONDITIONS_GET, config);
  //     setTermsAndConditionData(data.data);
  //     console.log("allConditions", data.data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };
  const getTermsAndConditionsData = async () => {
    try {
      const { data } = await axios.get(API_TERMS_AND_CONDITIONS_GET, config);
      setTermsAndConditionData(data.data);
      const extractedIds = data.data.map((item) => item.id);
      setIds(extractedIds);
      setLoading(false)
      console.log("allConditions", data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  useEffect(() => {
    getTermsAndConditionsData();
  }, []);

  useEffect(() => {
    const conditionsText = termsAndConditionData
      .map((item) => item.conditions + "<br/>" + "<br/>")
      .join("\n"); // Join conditions with newlines
    setAllConditions(conditionsText);
  }, [termsAndConditionData]);

  const handleEditorChange = (event, editor) => {
    const newData = editor.getData();
    setEditedConditions(newData); // Store edited content in state
  };

  const handleSave = async () => {
    // Send edited content to the server using an API
    try {
      await axios.post(
        `${API_TERMS_AND_CONDITIONS_UPDATE}${ids}/`,
        {
          conditions: editedConditions,
        },
        config
      );
      getTermsAndConditionsData();
      toast.success(`Terms & Conditions Updated successfully`, {
        position: "top-center",
        autoClose: 4000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      console.log("Data saved successfully!");
    } catch (error) {
      console.log(error);
      toast.error(`Something Went Wrong`, {
        position: "top-center",
        autoClose: 4000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  document.title = "Terms & Conditions";

  return (
    <React.Fragment>
      <div className="page-content">
   {
    loading=== true ?(<LoaderPage/>):(
      <>
           <Container fluid={true}>
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <CardTitle className=" mb-5">
                    <h3>Terms & Conditions</h3>
                  </CardTitle>

                  <Form method="post">
                    <div  >
                      <CKEditor
                        editor={ClassicEditor}
                        data={allConditions}
                        config={{
                          autoGrow_minHeight: 900, 
                        }}
                       
                        onReady={(editor) => {
                         
                        }}
                        onChange={handleEditorChange}
                      />
                    </div>
                  </Form> 

                  <Button className="mt-2" color="primary" onClick={handleSave}>
                    Save
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    )
   }
      </div>
    </React.Fragment>
  );
};

export default TermsAndConditions;
