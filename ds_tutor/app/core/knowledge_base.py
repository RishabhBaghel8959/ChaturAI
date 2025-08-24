from typing import Dict, List, Optional

from ..schemas import Resource


TOPIC_TO_RESOURCES: Dict[str, List[Resource]] = {
	"pandas": [
		Resource(
			title="Pandas Official Documentation",
			url="https://pandas.pydata.org/docs/",
			level="beginner",
			type="docs",
		),
		Resource(
			title="10 Minutes to pandas",
			url="https://pandas.pydata.org/docs/user_guide/10min.html",
			level="beginner",
			type="article",
		),
		Resource(
			title="Pandas Cookbook (2nd ed.)",
			url="https://pandas.pydata.org/pandas-docs/stable/user_guide/cookbook.html",
			level="intermediate",
			type="reference",
		),
	],
	"numpy": [
		Resource(
			title="NumPy User Guide",
			url="https://numpy.org/devdocs/user/",
			level="beginner",
			type="docs",
		),
		Resource(
			title="NumPy Quickstart",
			url="https://numpy.org/doc/stable/user/quickstart.html",
			level="beginner",
			type="article",
		),
	],
	"scikit-learn": [
		Resource(
			title="Scikit-learn User Guide",
			url="https://scikit-learn.org/stable/user_guide.html",
			level="intermediate",
			type="docs",
		),
		Resource(
			title="Scikit-learn Tutorials",
			url="https://scikit-learn.org/stable/tutorial/index.html",
			level="beginner",
			type="article",
		),
	],
	"statistics": [
		Resource(
			title="Think Stats (2nd Edition, free book)",
			url="https://greenteapress.com/wp/think-stats-2e/",
			level="beginner",
			type="book",
		),
		Resource(
			title="Introduction to Statistical Learning (ISLR, free PDF)",
			url="https://www.statlearning.com/",
			level="intermediate",
			type="book",
		),
	],
	"matplotlib": [
		Resource(
			title="Matplotlib Tutorials",
			url="https://matplotlib.org/stable/tutorials/",
			level="beginner",
			type="docs",
		),
	],
	"seaborn": [
		Resource(
			title="Seaborn Tutorials",
			url="https://seaborn.pydata.org/tutorial.html",
			level="beginner",
			type="docs",
		),
	],
}


_DEFAULT_TOP_PICKS: List[Resource] = [
	Resource(
		title="Kaggle Learn: Python",
		url="https://www.kaggle.com/learn/python",
		level="beginner",
		type="course",
	),
	Resource(
		title="Kaggle Learn: Pandas",
		url="https://www.kaggle.com/learn/pandas",
		level="beginner",
		type="course",
	),
	Resource(
		title="Scikit-learn User Guide",
		url="https://scikit-learn.org/stable/user_guide.html",
		level="intermediate",
		type="docs",
	),
]


CODE_TEMPLATES: Dict[str, str] = {
	"read_csv": (
		"import pandas as pd\n"
		"df = pd.read_csv('data.csv')\n"
		"print(df.head())\n"
	),
	"train_test_split": (
		"from sklearn.model_selection import train_test_split\n"
		"X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n"
	),
	"linear_regression": (
		"from sklearn.linear_model import LinearRegression\n"
		"model = LinearRegression()\n"
		"model.fit(X_train, y_train)\n"
		"print('R2:', model.score(X_test, y_test))\n"
	),
	"logistic_regression": (
		"from sklearn.linear_model import LogisticRegression\n"
		"clf = LogisticRegression(max_iter=1000)\n"
		"clf.fit(X_train, y_train)\n"
		"print('Accuracy:', clf.score(X_test, y_test))\n"
	),
	"random_forest": (
		"from sklearn.ensemble import RandomForestClassifier\n"
		"clf = RandomForestClassifier(n_estimators=200, random_state=42)\n"
		"clf.fit(X_train, y_train)\n"
		"print('Accuracy:', clf.score(X_test, y_test))\n"
	),
	"plot_histogram": (
		"import matplotlib.pyplot as plt\n"
		"plt.hist(series, bins=30)\n"
		"plt.xlabel('Value'); plt.ylabel('Frequency'); plt.title('Histogram')\n"
		"plt.show()\n"
	),
	"seaborn_pairplot": (
		"import seaborn as sns\n"
		"sns.pairplot(df, hue='target')\n"
	),
	"cross_validation": (
		"from sklearn.model_selection import cross_val_score\n"
		"scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')\n"
		"print(scores.mean(), scores.std())\n"
	),
	"sklearn_pipeline": (
		"from sklearn.pipeline import Pipeline\n"
		"from sklearn.preprocessing import StandardScaler\n"
		"from sklearn.linear_model import LogisticRegression\n"
		"pipe = Pipeline([('scaler', StandardScaler()), ('clf', LogisticRegression(max_iter=1000))])\n"
		"pipe.fit(X_train, y_train)\n"
		"print(pipe.score(X_test, y_test))\n"
	),
	"kmeans": (
		"from sklearn.cluster import KMeans\n"
		"km = KMeans(n_clusters=3, n_init=10, random_state=42)\n"
		"km.fit(X)\n"
		"print(km.labels_[:10])\n"
	),
}


def get_resources(topic: Optional[str], level: str = "beginner") -> List[Resource]:
	if not topic:
		return _DEFAULT_TOP_PICKS
	key = topic.lower().strip()
	if key in TOPIC_TO_RESOURCES:
		return TOPIC_TO_RESOURCES[key]
	# fallback: search by substring in titles
	results: List[Resource] = []
	for items in TOPIC_TO_RESOURCES.values():
		for res in items:
			if key in res.title.lower():
				results.append(res)
	return results or _DEFAULT_TOP_PICKS


def get_code_snippet(task: str, framework: Optional[str] = None) -> Optional[str]:
	key = (task or "").lower().replace(" ", "_")
	if key in CODE_TEMPLATES:
		return CODE_TEMPLATES[key]
	# naive mapping
	if "linear" in key and "reg" in key:
		return CODE_TEMPLATES["linear_regression"]
	if "logistic" in key:
		return CODE_TEMPLATES["logistic_regression"]
	if "random" in key and "forest" in key:
		return CODE_TEMPLATES["random_forest"]
	if "kmeans" in key or "k-means" in key:
		return CODE_TEMPLATES["kmeans"]
	return None