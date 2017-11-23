import { PluginFunction } from 'vue'

declare class Validator {
  static install: PluginFunction<never>
}

export = Validator