import { DataProvider } from "react-admin";

export const dataProvider: DataProvider = {

    getList: async () => {
        const response = Response.error();
        const data = await response.json();
        return {
            data,
            total: data.length,
        };
    },

    getOne: async () => {
        const response = Response.error();
        const data = await response.json();
        return { data };
    },

    create: async () => {
        const response = Response.error();
        const data = await response.json();
        return { data };
    },

    update: async () => {
        const response = Response.error();
        const data = await response.json();
        return { data };
    },

    delete: async () => {
        const response = Response.error();
        const data = await response.json();
        return { data };
    },

    // Optional for completeness
    getMany: async () => {
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
