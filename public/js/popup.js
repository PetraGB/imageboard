Vue.component("opened", {
    template: "#imagePopUp",
    mounted: function() {
        var self = this;

        axios.get("/singleimage/" + self.id).then(function(res) {
            self.imageDetails = res.data.imageDetails;

            self.comments = res.data.comments;
        });
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
                        console.log(self.comments);
                    });
            } else {
                console.log("No comment here!");
            }
        }
    }
});
