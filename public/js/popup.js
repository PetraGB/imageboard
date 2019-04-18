function getImageById(self) {
    if (!isNaN(self.id)) {
        axios.get("/singleimage/" + self.id).then(function(res) {
            if (!res.data.imageDetails) {
                self.$emit("closing");
            }
            self.imageDetails = res.data.imageDetails;
            self.comments = res.data.comments;

            console.log(res.data);
        });
    } else {
        self.$emit("closing");
    }
}

Vue.component("opened", {
    template: "#imagePopUp",
    mounted: function() {
        var self = this;
        getImageById(self);
    },
    watch: {
        id: function() {
            var self = this;
            getImageById(self);
        }
    },
    data: function() {
        return {
            imageDetails: {},
            comments: [],
            commentInput: {
                comment: "",
                username: ""
            }
        };
    },
    props: ["id"],
    methods: {
        clickAway: function() {
            this.$emit("closing");
        },
        postComment: function(e) {
            var self = this;

            if (this.commentInput.comment) {
                axios
                    .post("/comment", {
                        comment: this.commentInput.comment,
                        username: this.commentInput.username,
                        id: this.id
                    })
                    .then(function(response) {
                        self.comments.push(response.data);
                    });
            } else {
                console.log("No comment here!");
            }
        }
    }
});
