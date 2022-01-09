window.addEventListener("DOMContentLoaded", (event) => {
  addTeslaEvents();
});

const addTeslaEvents = () => {
  document
    .getElementById("submit")!
    .addEventListener("click", handleLoginFormSubmit);

  document
    .getElementById("flash-lights")!
    .addEventListener("click", (e) => handleCarCommand(e as any));

  document
    .getElementById("auth-vehicle-submit")!
    .addEventListener("click", handleAuthandIdSubmit);
};

let teslaState: TeslaState = {
  accessToken: "",
  loading: false,
  vehicleId: "",
};

const handleAuthandIdSubmit = () => {
  teslaHandleBtnLoader(true);
  const auth = (<HTMLInputElement>document.getElementById("auth")).value;
  const carId = (<HTMLInputElement>document.getElementById("carId")).value;

  const formData: TeslaInitialFormDataAuthandId = {
    auth,
    carId,
  };

  teslaState.accessToken = formData.auth;
  teslaState.vehicleId = formData.carId;
  teslaHandleBtnLoader(false);

  console.log(teslaState)

};

// const BASE_URL = "https://marketbasket.ngrok.io";
const TESLA_BASE_URL = "http://localhost:3500";

const teslaHandleBtnLoader = (loading: boolean) => {
  const button = document.getElementById("submit");
  teslaState.loading = loading;
  if (teslaState.loading && button) {
    button.setAttribute("disabled", "true");
    button.innerHTML =
      '<i id="loader-btn" class="fa fa-circle-o-notch fa-spin"></i> Loading';
    document.getElementById("loader-btn")!.style.display = "inline-block";
  } else if (!teslaState.loading && button) {
    button.removeAttribute("disabled");
    button.innerHTML = "Submit";
  }
};

const handleLoginFormSubmit = async () => {
  teslaHandleBtnLoader(true);
  const email = (<HTMLInputElement>document.getElementById("email")).value;
  const password = (<HTMLInputElement>document.getElementById("password"))
    .value;

  const formData: TeslaInitialFormData = {
    email,
    password,
  };

  await teslaLogin(formData);
};
// eu-0f96c749c7bbb31177893e685a936a9ac56c6c3fd1c8478edbb914d08f6d75b6
const teslaLogin = async (formData: TeslaInitialFormData) => {
  try {
    const response = await fetch(`${TESLA_BASE_URL}/main/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data: TeslaAuthResponse = await response.json();

    console.log("data", data);
    teslaState.accessToken = data.access_token;
    // TODO: set it in local storage too maybe
    teslaHandleBtnLoader(false);
  } catch (err) {
    console.log("apiCall error", err);
    teslaHandleBtnLoader(false);
  }
};

// TODO: make generic
const handleCarCommand = async (e: any) => {
  // const chargePortStatus = e.target.checked ? "open" : "close";
  try {
    await fetch(
      `https://owner-api.teslamotors.com/api/1/vehicles/${teslaState.vehicleId}/command/flash_lights`,
      {
        method: "POST",
        headers: {
          Authorisation: `Bearer ${teslaState.accessToken!}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (e) {
    console.log(e);
  }
};

//#region types
type TeslaState = {
  accessToken?: TeslaAuthResponse["access_token"];
  loading: boolean;
  vehicleId?: string;
};

type TeslaInitialFormData = {
  email: string;
  password: string;
};

type TeslaInitialFormDataAuthandId = {
  auth: string;
  carId: string;
};

type TeslaAuthResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  created_at: number;
};
//#endregion
