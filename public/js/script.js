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
        getMore: function() {
            var self = this;
            var lastId = self.images[self.images.length - 1].id;

            axios.get("/more/" + lastId).then(function(newImages) {
                for (var i = 0; i < newImages.data.length; i++) {
                    self.images.push(newImages.data[i]);
                }

                if (
                    self.images[self.images.length - 1].id ==
                    newImages.data[0].lowest
                ) {
                    self.stillMore = false;
                }
            });
        },
        closeImage: function() {
            this.showingImage = null;
            location.hash = "";
        }
    },
    data: {
        images: [],
        stillMore: true,
        form: {
            title: "",
            description: "",
            username: "",
            file: null
        },
        showingImage: location.hash.slice(1) || 0
    }
});
