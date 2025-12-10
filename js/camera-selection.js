/**
 * Camera Selection System
 * Allows users to select a camera from product pages and pre-fill customize page
 */

const CameraSelection = {
    STORAGE_KEY: 'piercelens_selected_camera',

    /**
     * Set the selected camera (called from camera product pages)
     */
    selectCamera: function(cameraId, cameraName) {
        const cameraData = {
            id: cameraId,
            name: cameraName,
            selectedAt: new Date().toISOString()
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cameraData));
    },

    /**
     * Get the selected camera (called from customize page)
     */
    getSelectedCamera: function() {
        const cameraCookie = localStorage.getItem(this.STORAGE_KEY);
        if (cameraCookie) {
            try {
                return JSON.parse(cameraCookie);
            } catch (e) {
                return null;
            }
        }
        return null;
    },

    /**
     * Clear the selected camera
     */
    clearSelection: function() {
        localStorage.removeItem(this.STORAGE_KEY);
    },

    /**
     * Navigate to customize page with selected camera
     */
    goToCustomize: function(cameraId, cameraName) {
        this.selectCamera(cameraId, cameraName);
        window.location.href = '../../customize/index.html';
    }
};
