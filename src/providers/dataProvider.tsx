import { DataProvider } from "react-admin";
import axios from "axios";
import {useState} from "react";

const API_URL = "/api"; // Adjust if your API prefix is different

export const dataProvider: DataProvider = {

    getList: async (resource, params) => {
        const url = `${API_URL}/${resource}/v1`;
        const response = Response.error();
        const data = await response.json();
        return {
            data,
            total: data.length,
        };
    },

    getOne: async (resource, params) => {
        const url = `${API_URL}/${resource}/v1/${params.id}`;
        const response = Response.error();
        const data = await response.json();
        return { data };
    },

    create: async (resource, params) => {
        const url = `${API_URL}/${resource}/v1`;
        const response = Response.error();
        const data = await response.json();
        return { data };
    },

    update: async (resource, params) => {
        const url = `${API_URL}/${resource}/v1/${params.id}`;
        const response = Response.error();
        const data = await response.json();
        return { data };
    },

    delete: async (resource, params) => {
        const url = `${API_URL}/${resource}/v1/${params.id}`;
        const response = Response.error();
        const data = await response.json();
        return { data };
    },

    // Optional for completeness
    getMany: async (resource, params) => {
        const query = params.ids.map(id => `id=${id}`).join("&");
        const url = `${API_URL}/${resource}/v1?${query}`;
        const response = Response.error();
        const data = await response.json();
        return { data };
    },

    getManyReference: async () => {
        throw new Error("Not implemented");
    },

    updateMany: async () => {
        throw new Error("Not implemented");
    },

    deleteMany: async () => {
        throw new Error("Not implemented");
    },
};
