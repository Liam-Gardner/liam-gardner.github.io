var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
window.addEventListener("DOMContentLoaded", function (event) {
    addTeslaEvents();
});
var addTeslaEvents = function () {
    document
        .getElementById("submit")
        .addEventListener("click", handleLoginFormSubmit);
    document
        .getElementById("flash-lights")
        .addEventListener("click", function (e) { return handleCarCommand(e); });
    document
        .getElementById("auth-vehicle-submit")
        .addEventListener("click", handleAuthandIdSubmit);
};
var teslaState = {
    accessToken: "",
    loading: false,
    vehicleId: "",
};
var handleAuthandIdSubmit = function () {
    teslaHandleBtnLoader(true);
    var auth = document.getElementById("auth").value;
    var carId = document.getElementById("carId").value;
    var formData = {
        auth: auth,
        carId: carId,
    };
    teslaState.accessToken = formData.auth;
    teslaState.vehicleId = formData.carId;
    teslaHandleBtnLoader(false);
    console.log(teslaState);
};
// const BASE_URL = "https://marketbasket.ngrok.io";
var TESLA_BASE_URL = "http://localhost:3500";
var teslaHandleBtnLoader = function (loading) {
    var button = document.getElementById("submit");
    teslaState.loading = loading;
    if (teslaState.loading && button) {
        button.setAttribute("disabled", "true");
        button.innerHTML =
            '<i id="loader-btn" class="fa fa-circle-o-notch fa-spin"></i> Loading';
        document.getElementById("loader-btn").style.display = "inline-block";
    }
    else if (!teslaState.loading && button) {
        button.removeAttribute("disabled");
        button.innerHTML = "Submit";
    }
};
var handleLoginFormSubmit = function () { return __awaiter(_this, void 0, void 0, function () {
    var email, password, formData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                teslaHandleBtnLoader(true);
                email = document.getElementById("email").value;
                password = document.getElementById("password")
                    .value;
                formData = {
                    email: email,
                    password: password,
                };
                return [4 /*yield*/, teslaLogin(formData)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// eu-0f96c749c7bbb31177893e685a936a9ac56c6c3fd1c8478edbb914d08f6d75b6
var teslaLogin = function (formData) { return __awaiter(_this, void 0, void 0, function () {
    var response, data, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, fetch(TESLA_BASE_URL + "/main/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formData),
                    })];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                console.log("data", data);
                teslaState.accessToken = data.access_token;
                // TODO: set it in local storage too maybe
                teslaHandleBtnLoader(false);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.log("apiCall error", err_1);
                teslaHandleBtnLoader(false);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// TODO: make generic
var handleCarCommand = function (e) { return __awaiter(_this, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, fetch("https://owner-api.teslamotors.com/api/1/vehicles/" + teslaState.vehicleId + "/command/flash_lights", {
                        method: "POST",
                        headers: {
                            Authorisation: "Bearer " + teslaState.accessToken,
                            "Content-Type": "application/json",
                        },
                    })];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                console.log(e_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
//#endregion
