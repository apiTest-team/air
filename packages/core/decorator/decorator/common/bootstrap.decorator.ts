import { BootstrapOptions } from "../../interface/bootstrap.interface";
import { Configuration } from "./configuration.decorator";
import { ConfigurationOptions } from "../../interface/configuration.interface";
import { Component } from "./component.decorator";
import { Scope } from "./objectdef.decorator";
import { ScopeEnum } from "../../interface";
import { saveClassMetadata} from "../../manager/default.manager";
import { AIR_BOOT_STARTER } from "../../constant";
import { isFunction } from "../../../utils";
import * as path from "path";

export interface AirBootOptions{
  bootstrapOptions?:BootstrapOptions,
  configurationOptions?:ConfigurationOptions
}
/**
 * 启动类
 * @param opts 启动参数
 * @constructor
 */
export const AirBootApplication = (opts?:AirBootOptions):ClassDecorator=>{
  return target => {
    console.log(process.cwd());
    // 设置默认配置文件
    const defaultConfiguration:ConfigurationOptions = {
      importConfigs:[
        path.join(process.cwd(),"./config")
      ]
    }
    const configurationOptions = Object.assign({},defaultConfiguration,opts?.configurationOptions)
    // 设置默认的bootstrap配置文件
    const defaultBootstrapOptions:BootstrapOptions = {
      baseDir:process.cwd(),
      configurationModule:[target]
    }
    const bootStrapOptions = Object.assign({},defaultBootstrapOptions,opts?.bootstrapOptions)
    // 自动配置
    Configuration(configurationOptions)(target)
    // 是一个组件
    Component()(target)
    // 装饰当前类为单例
    Scope(ScopeEnum.Singleton)(target)
    // 保存启动配置参数
    saveClassMetadata(AIR_BOOT_STARTER,bootStrapOptions,target)
    // 启动
    target["main"] && isFunction(target["main"]) && target["main"](process.argv.splice(2))
  }
}