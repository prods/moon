/* ======= Global Utilities ======= */

/**
 * Logs a Message
 * @param {String} msg
 */
const log = function(msg) {
  if(!Moon.config.silent) console.log(msg);
}

/**
 * Throws an Error
 * @param {String} msg
 */
const error = function(msg) {
  if(!Moon.config.silent) console.error("[Moon] ERR: " + msg);
}

/**
 * Adds DOM Updates to Queue
 * @param {Object} instance
 */
const queueBuild = function(instance) {
  if(!instance.$queued && !instance.$destroyed) {
    instance.$queued = true;
    setTimeout(function() {
      instance.build();
      callHook(instance, 'updated');
      instance.$queued = false;
    }, 0);
  }
}

/**
 * Gives Default Metadata for a VNode
 * @return {Object} metadata
 */
const defaultMetadata = function() {
  return {
    shouldRender: true,
    eventListeners: {}
  }
}

/**
 * Escapes a String
 * @param {String} str
 */
const escapeString = function(str) {
	const NEWLINE_RE = /\n/g;
	const DOUBLE_QUOTE_RE = /"/g;
  const BACKSLASH_RE = /\\/g;
  return str.replace(BACKSLASH_RE, "\\\\").replace(DOUBLE_QUOTE_RE, "\\\"").replace(NEWLINE_RE, "\\n");
}

/**
 * Resolves an Object Keypath and Sets it
 * @param {Object} instance
 * @param {Object} obj
 * @param {String} keypath
 * @param {String} val
 * @return {Object} resolved object
 */
const resolveKeyPath = function(instance, obj, keypath, val) {
  let i = null;
  keypath.replace(/\[(\w+)\]/g, function(match, index) {
    keypath = keypath.replace(match, `.${index}`);
  });
  var path = keypath.split(".");
  for(i = 0; i < path.length - 1; i++) {
    const propName = path[i];
    obj = obj[propName];
  }
  obj[path[i]] = val;
  return path[0];
}

/**
 * Compiles a Template
 * @param {String} template
 * @param {Boolean} isString
 * @return {String} compiled template
 */
const compileTemplate = function(template, isString) {
  const TEMPLATE_RE = /{{([A-Za-z0-9_$@]+)([A-Za-z0-9_.()'"+\-*/\s\[\]]+)?}}/gi;
  let compiled = template;
  template.replace(TEMPLATE_RE, function(match, key, modifiers) {
    if(!modifiers) {
      modifiers = '';
    }
    if(isString) {
      compiled = compiled.replace(match, `" + instance.get("${key}")${modifiers} + "`);
    } else {
      compiled = compiled.replace(match, `instance.get("${key}")${modifiers}`);
    }
  });
  return compiled;
}

/**
 * Extracts the Slots From Component Children
 * @param {Array} children
 * @return {Object} extracted slots
 */
const getSlots = function(children) {
  let slots = {};

  // No Children Means No Slots
  if(!children) {
    return slots;
  }

  let defaultSlotName = "default";
  slots[defaultSlotName] = [];

  for(let i = 0; i < children.length; i++) {
    var child = children[i];
    var childProps = child.props.attrs;
    if(childProps.slot) {
      if(!slots[childProps.slot]) {
        slots[childProps.slot] = [child];
      } else {
        slots[childProps.slot].push(child);
      }
      delete childProps.slot;
    } else {
      slots[defaultSlotName].push(child);
    }
  }

  return slots;
}

/**
 * Extends an Object with another Object's properties
 * @param {Object} parent
 * @param {Object} child
 * @return {Object} Extended Parent
 */
const extend = function(parent, child) {
  for(let key in child) {
    parent[key] = child[key];
  }
  return parent;
}

/**
 * Merges Two Objects Together
 * @param {Object} parent
 * @param {Object} child
 * @return {Object} Merged Object
 */
const merge = function(parent, child) {
  let merged = {};
  for(var key in parent) {
    merged[key] = parent[key];
  }
  for (var key in child) {
    merged[key] = child[key];
  }
  return merged;
}

/**
 * Calls a Hook
 * @param {Object} instance
 * @param {String} name
 */
const callHook = function(instance, name) {
  const hook = instance.$hooks[name];
  if(hook) {
    hook.call(instance);
  }
}

/**
 * Does No Operation
 */
const noop = function() {

}
