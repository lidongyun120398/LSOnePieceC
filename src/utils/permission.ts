import type { Directive } from "vue";

const permissionDirective: Directive<HTMLButtonElement, string> = {
  mounted(el, binding) {
    const { value } = binding;
    const hasPermission = checkPermission(value);

    if (!hasPermission) {
      el.style.display = "none";
      el.disabled = true;
    }
  },

  updated(el, binding) {
    const { value } = binding;
    const hasPermission = checkPermission(value);

    if (!hasPermission) {
      el.style.display = "none";
      el.disabled = true;
    }
  },
};
const checkPermission = (permission: string) => {
  const userPermission = getCurrentUserPermission();
  return userPermission.includes(permission);
};

const getCurrentUserPermission = () => ["edit", "delete"];

export default permissionDirective;
