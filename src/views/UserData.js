import { ref, onMounted } from 'vue';

const userName = ref("");

const setUsername = () => {
    localStorage.setItem("username", userName.value);
};

const getUsername = () => {
    userName.value = localStorage.getItem("username") || "";
};

const deleteUsername = () => {
    localStorage.removeItem("username");
    userName.value = "";
};

onMounted(() => {
    getUsername();
});

// Funktionen und Variablen exportieren
export { userName, setUsername, getUsername, deleteUsername };
