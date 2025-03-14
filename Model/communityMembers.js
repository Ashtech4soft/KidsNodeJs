const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommunityMemberSchema = new Schema(
  {
    communityId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Community', 
      required: true 
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    }
  },
  {
    collection: 'community_members'
  }
);

module.exports = mongoose.model('CommunityMember', CommunityMemberSchema);
