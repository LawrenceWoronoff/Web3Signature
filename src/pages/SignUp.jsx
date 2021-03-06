import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import Title from "../components/Title";
import swal from "sweetalert";

import { useLocation, useParams, useSearchParams } from "react-router-dom";
import WalletContext from "../context/WalletContext";
import { useNavigate } from "react-router-dom";
import { getProjectInfo, createProject, saveProject } from "../service/actions";

const SignUp = () => {
  const { projectId } = useParams();
  const {account} = useContext(WalletContext);
  const navigate = useNavigate();
  const [projectInfo, setProjectInfo] = useState({});


  // form data state
  const [formData, setformData] = useState({
    
  });

  const handleChange = (ev) =>{
    let _name = ev.target.name;
    let _val = ev.target.value;
    setformData({...formData, [_name]: _val});
    
    let storageFormData = JSON.parse(localStorage.getItem("formData"));
    const object = {...storageFormData,  [_name]: _val};
    localStorage.setItem("formData", JSON.stringify(object));
  }

  const onSubmit = () => {
    if(!account){
      swal("Warning!", "Please login first", "warning");
      return;
    }
    
    const now = new Date();

    if(projectId == undefined){ // Form Submit for Create
      let _formData = {...formData, "wallet_address": account};
      swal({
      title: "Are you sure?",
      text: "Do you want to create new project?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
        createProject(_formData)
          .then(res=>res.json())
          .then(res=>{
            //console.log(res);
            navigate('/projects');
          })
        localStorage.removeItem("formData");  
      });
    } else { // Form Submit for Update
      let _formData = {...formData, "wallet_address": account};
      swal({
        title: "Are you sure?",
        text: "Do you want to create new project?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        saveProject(projectId, _formData)
          .then(res=>res.json())
          .then(res=>{
            if(res.status == "ok"){
              swal("Success!", "Saved successfully", "success");
            }
          })
      });
    }
  }

  useEffect(()=>{
    if(!projectId || projectId == undefined) {
      var initialObj = {
        registration_start_date: '',
        registration_end_date: '',
        max_entries: '',
      };
      var storageObject = JSON.parse(localStorage.getItem("formData"));
      setformData({...initialObj, ...storageObject});
      return;
    }
    getProjectInfo(projectId)
    .then(res=>res.json())
    .then(res=>{
      //console.log(res);
      
      setProjectInfo(res);
      setformData({
        registration_start_date: res.registration_start_date == null ? '' : res.registration_start_date.substring(0, 10),
        registration_end_date:  res.registration_end_date == null ? '' : res.registration_end_date.substring(0, 10),
        max_entries:  res.max_entries == 'null' ? '' : res.max_entries,
      });
    });
  }, [projectId]);

  return (
    <>
      <Header projectId={projectId}  header={projectId == undefined} slug={projectInfo.slug}/>
      <div className="App__inner">
        <div className="App__inner-content center-block">
          <div className="App__sidebar">
            <SideBar projectId={projectId}/>
          </div>
          <div className="App__routes">
            <form>
              <div className="signup">
                <Title
                  title={"Schedule"}
                  subtitle={"Open and close your list at specific times."}
                />
                <div className="signup__top bg">
                  <div className="signup__top-inner">
                    <div className="input-container">
                      <div className="input-container__title">
                        Registration start date
                      </div>
                      <div className="info__date-content-input">
                        <input 
                          type="date" 
                          name="registration_start_date"
                          value={formData.registration_start_date}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="input-container__subtitle">
                        UTC Timezone. When should people be able to join your
                        list?
                      </div>
                    </div>
                    <div className="input-container">
                      <div className="input-container__title">
                        Registration end date
                      </div>
                      <div className="info__date-content-input">
                        <input 
                          type="date" 
                          name="registration_end_date"
                          value={formData.registration_end_date}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="input-container__subtitle">
                        UTC Timezone. When should registration close for your
                        list?
                      </div>
                    </div>
                  </div>
                </div>
                <Title title={"Max Entries"} />
                <div className="signup__bot bg">
                  <div className="input-container">
                    <div className="input-container__title">Must Follow</div>
                    <div className="input-container__input">
                      <input 
                        type="text" 
                        name="max_entries"
                        value={formData.max_entries}
                        placeholder="Max entries" 
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input-container__subtitle">
                      Once your list hits this many, registration will
                      immediately close.
                    </div>
                  </div>
                </div>
                <button className="signup__btn" type="button" onClick={onSubmit}>{projectId == undefined ? 'Create Project' : 'Update Project'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
