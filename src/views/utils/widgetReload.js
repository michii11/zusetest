import config from '../config/config.json'



const getWidgets = () => {
    const defaultWidgets = config.prefs_default_widgets;
  
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('prefs_widgets');
        return stored ? JSON.parse(stored) : defaultWidgets;
      }
    } catch (err) {
      console.warn('Fehler beim Laden der Widgets:', err);
    }
  
    return defaultWidgets;
  };
  
  const saveWidgets = (widgets) => {
    try {
      localStorage.setItem('prefs_widgets', JSON.stringify(widgets));
    } catch (err) {
      console.error('Fehler beim Speichern der Widgets:', err);
    }
  };
  
  export function useWidgets() {
    return {
      getWidgets,
      saveWidgets
    };
  }

  
  