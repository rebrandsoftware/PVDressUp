function Contest(id, onlineId, name, style, entryAllowNames, entryAllowCaptions, voteShowScore, voteRequireName, voteRequirePhoto, voteAllowComments, categories, isOnline, isPasswordProtected, password, savePhotos, saveVoterPhotos, backgroundImage) {
	this.id = id;
	this.onlineId = onlineId;
	this.name = name;
	this.style = style;
	this.entryAllowNames = entryAllowNames;
	this.entryAllowCaptions = entryAllowCaptions;
	this.voteShowScore = voteShowScore;
	this.voteRequireName = voteRequireName;
	this.voteRequirePhoto = voteRequirePhoto;
	this.voteAllowComments = voteAllowComments;
	this.categories = categories;
	this.isOnline = isOnline;
	this.isPasswordProtected = isPasswordProtected;
	this.password = password;
	this.savePhotos=savePhotos;
	this.saveVoterPhotos=saveVoterPhotos;
	this.backgroundImage=backgroundImage;
}

function ContestEntry(id, photo, name, caption, hidden) {
	this.id = id;
	this.photo = photo;
	this.name = name;
	this.caption = caption;
	this.hidden = hidden;
	this.votes = 0;
}

function Vote(id, entryId, name, photo, category) {
	this.id = id;
	this.entryId;
	this.name = name;
	this.photo = photo;
	this.category = category;
}

function Category(name) {
	this.name = name;
}

function Results(entry, votes) {
	this.entry = entry;
	this.votes = votes;
}

function CategoryResults(category, sort) {
	this.category=category;
	this.results=[];
	this.sort=sort;
}
