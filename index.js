"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/docs', express_1.default.static(path_1.default.join(__dirname, 'docs')));
app.get('/docs', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'docs', 'docs.html'));
});
// hi chat
// Proxy request to Roblox with dynamic URL and parameters
app.use('/:service/*', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { service } = req.params; // Service name (e.g., inventory, users, etc.)
    const proxyPath = req.params[0]; // Capture the remaining part of the URL (e.g., assets/21070012/owners)
    const query = req.query; // Capture query parameters (e.g., sortOrder, limit)
    try {
        // Build the proxied URL
        const targetUrl = `https://${service}.roblox.com/${proxyPath}`;
        // Make the proxy request using axios
        const response = yield (0, axios_1.default)({
            method: req.method,
            url: targetUrl,
            params: query, // Forward the query parameters
            data: req.body, // Forward the request body if present
            headers: Object.assign(Object.assign({}, req.headers), { 'User-Agent': 'RoProxy', 
                // Remove specific headers that shouldn't be forwarded
                'Roblox-Id': undefined, host: `${service}.roblox.com` }),
        });
        // Forward the response from Roblox to the client
        res.status(response.status).send(response.data);
    }
    catch (error) {
        // Handle errors gracefully
        if (error.response) {
            // If the error has a response from Roblox, forward it
            res.status(error.response.status).send(error.response.data);
        }
        else {
            // Otherwise, send a general error
            res.status(500).send('Proxy failed to connect. Please try again.');
        }
    }
}));
// Start the server
app.listen(3000, () => {
    console.log('Proxy server is running on port 3000');
});
exports.default = app;
