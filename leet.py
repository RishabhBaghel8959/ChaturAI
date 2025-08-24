import pandas as pd

data = {
    'id': [1, 2, 3, 4, 5, 6],
    'score': [3.50, 3.65, 4.00, 3.85, 4.00, 3.65]
}
df = pd.DataFrame(data)

def order_scores(scores: pd.DataFrame) -> pd.DataFrame:
    scores = scores.sort_values(by='score', ascending=False)


    scores['rank'] = scores['score'].rank(method='dense', ascending=False).astype(int)



    return scores[['score', 'rank']]


result = order_scores(df)
print(result)
    