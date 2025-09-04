import * as LatteMagusVue from '@/latte-magus-vue';
import {appConfig} from "@/configs/appConfig";

const Objects = LatteMagusVue.default.utils.Objects;
const Message = LatteMagusVue.default.utils.Message;
const {Local, Session} = LatteMagusVue.default.utils.appStorageInstaller(appConfig);
const {ApiRequest} = LatteMagusVue.default.utils.apiRequestInstaller(appConfig, Session);

export {
    Objects,
    Local,
    Session,
    ApiRequest,
    Message
}
