!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Mozart=e()}}(function(){var define,module,exports;return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}({1:[function(_dereq_,module,exports){var Class=_dereq_("./lib/class");module.exports=function(name,definition){return new Class(name,definition).construct()}},{"./lib/class":2}],2:[function(_dereq_,module,exports){var createKey=_dereq_("private-parts").createKey;var constructorToClassMap=new WeakMap;var protectToPrototypeMap=new WeakMap;function Class(name,definition,parent){if(typeof name=="function"){parent=definition;definition=name;name=null}this.definition=definition;this.parent=parent;this.Ctor=createConstructor(name);this.Ctor.subclass=subclass;this.Ctor.final=final;constructorToClassMap.set(this.Ctor,this);this._setupInheritance();this._storeSecrets();this._makeAccessors()}Class.prototype.construct=function(){if(typeof this.definition=="function"){this.definition.call(this.Ctor,this.Ctor.prototype,this.protectedKey,this.protectedMethods,this.privateKey,this.privateMethods)}return this.Ctor};Class.prototype._setupInheritance=function(){if(this.parent){this.Ctor.super_=this.parent.Ctor;this.Ctor.prototype=Object.create(this.parent.Ctor.prototype,{constructor:{value:this.Ctor},"super":{value:this.parent.Ctor.prototype}})}};Class.prototype._storeSecrets=function(){if(this.parent){this.protectedKey=this.parent.protectedKey;this.protectedMethods=Object.create(this.parent.protectedMethods,{"super":{value:this.parent.protectedMethods}})}else{this.protectedMethods={};this.protectedKey=createKey(protectedFactory)}protectToPrototypeMap.set(this.Ctor.prototype,this.protectedMethods);this.privateMethods={};this.privateKey=createKey(this.privateMethods)};Class.prototype._makeAccessors=function(){var Ctor=this.Ctor;var _=this.protectedKey;Object.defineProperties(Ctor,{addGetters:{value:function(props){if(!Array.isArray(props))props=[].slice.call(arguments);props.forEach(function(prop){Ctor.prototype["get"+capitalize(prop)]=function(){return _(this)[prop]}})}},addSetters:{value:function(props){if(!Array.isArray(props))props=[].slice.call(arguments);props.forEach(function(prop){Ctor.prototype["set"+capitalize(prop)]=function(value){_(this)[prop]=value}})}},addAccessors:{value:function(){Ctor.addGetters.apply(Ctor,arguments);Ctor.addSetters.apply(Ctor,arguments)}}})};function subclass(name,definition){if(typeof name=="function"){definition=name;name=null}var parent=constructorToClassMap.get(this);if(parent.final){throw new Error("Cannot subclass constructors marked final.")}return new Class(name,definition,parent).construct()}function final(){var cls=constructorToClassMap.get(this);cls.final=true}function protectedFactory(instance){var publicPrototype=Object.getPrototypeOf(instance);var protectedPrototype=protectToPrototypeMap.get(publicPrototype);if(!protectedPrototype){throw new Error("The protected key function only accepts instances "+"of objects created using Mozart constructors.")}return Object.create(protectedPrototype)}function createConstructor(name){if(!name)name="";var factory=new Function("return function "+name+"() {\n"+"if (typeof this.init == 'function')"+"this.init.apply(this, arguments) }");return factory()}function capitalize(string){return string.substr(0,1).toUpperCase()+string.substr(1)}module.exports=Class},{"private-parts":3}],3:[function(_dereq_,module,exports){function createKey(factory){factory=typeof factory=="function"?factory:createBound(factory);var store=new WeakMap;var seen=new WeakMap;return function(key){if(typeof key!="object")return;var value=store.get(key);if(!value){if(seen.has(key)){value=key}else{value=factory(key);store.set(key,value);seen.set(value,true)}}return value}}function createBound(obj){return function(){return Object.create(obj||Object.prototype)}}module.exports={createKey:createKey}},{}]},{},[1])(1)});