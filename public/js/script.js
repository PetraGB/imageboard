new Vue({
    el: "#main",
    mounted: function() {
        var self = this;
        axios.get("/board").then(function(resp) {
            self.images = resp.data;
        });

        window.addEventListener("hashchange", function() {
            self.showingImage = location.hash.slice(1);
        });
    },
    methods: {
        handleFileChange: function(e) {
            this.form.file = e.target.files[0];
        },
        uploadFile: function(e) {
            var formData = new FormData();
            var self = this;

            formData.append("file", this.form.file);
            formData.append("username", this.form.username);
            formData.append("description", this.form.description);
            formData.append("title", this.form.title);
            axios.post("/uploading", formData).then(function(response) {
                self.images.unshift(response.data);
            });
        },
        openUp: function(id) {
            this.showingImage = id;
        },
        closeImage: function() {
            this.showingImage = null;
            location.hash = "";
        }
    },
    data: {
        images: [],
        form: {
            title: "",
            description: "",
            username: "",
            file: null
        },
        showingImage: location.hash.slice(1) || 0
    }
});
